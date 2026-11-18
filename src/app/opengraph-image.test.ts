import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { siteContentFixture } from "@/test/fixtures";
import { createImageProject, pngSize } from "@/test/render";

// The route reads `SITE_CONTENT.images.logo` from `<cwd>/public`. Each test points
// the logo at a fixture inside a temporary "project" directory and renders the
// real route (Satori + resvg), so nothing about the rendering is mocked.
const content = siteContentFixture();
vi.mock("@/lib/site-content", () => ({ SITE_CONTENT: content }));

const project = createImageProject();
afterAll(project.cleanup);

async function render(logo: string): Promise<{ type: string | null; png: Buffer }> {
  vi.spyOn(process, "cwd").mockReturnValue(project.dir);
  content.images.logo = logo;
  const { default: OpenGraphImage } = await import("./opengraph-image");
  const res = await OpenGraphImage();
  return { type: res.headers.get("content-type"), png: Buffer.from(await res.arrayBuffer()) };
}

describe("share image (/opengraph-image)", () => {
  let withoutLogo: Buffer;

  beforeAll(async () => {
    // Control: same layout with a fully transparent logo of the same size.
    withoutLogo = (await render("/images/blank.png")).png;
  });

  it.each(["/images/logo.png", "/images/logo.jpg"])(
    "renders a 1200x630 PNG with the logo drawn when the logo is %s",
    async (logo) => {
      const { type, png } = await render(logo);
      expect(type).toBe("image/png");
      expect(pngSize(png)).toEqual({ width: 1200, height: 630 });
      // If the logo failed to decode it would render as nothing, matching the control.
      expect(png.equals(withoutLogo)).toBe(false);
    },
    20_000
  );

  it("renders the committed site logo", async () => {
    vi.spyOn(process, "cwd").mockReturnValue(path.resolve(__dirname, "../.."));
    content.images.logo = siteContentFixture().images.logo;
    const { default: OpenGraphImage } = await import("./opengraph-image");
    const png = Buffer.from(await (await OpenGraphImage()).arrayBuffer());
    expect(pngSize(png)).toEqual({ width: 1200, height: 630 });
  }, 20_000);

  // The renderer can't draw WebP and doesn't report it: the logo just disappears.
  // The route must fail the build instead, even if the file is misnamed .png.
  it.each([
    ["a WebP logo", "logo.webp"],
    ["a WebP file named .png", "webp-named.png"],
    ["a file that is not an image", "not-an-image.png"],
  ])("fails the build with a clear message for %s", async (_case, file) => {
    await expect(render(`/images/${file}`)).rejects.toThrow(
      `/images/${file} must be a PNG or JPG image for the share card.`
    );
  });
});

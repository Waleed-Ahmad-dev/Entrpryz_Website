import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { siteContentFixture } from "@/test/fixtures";
import { createImageProject, pngSize } from "@/test/render";

// Both icon routes render the CMS square logo (images.logoSquare) with the real
// renderer; only the image location is redirected to a temporary project.
const content = siteContentFixture();
vi.mock("@/lib/site-content", () => ({ SITE_CONTENT: content }));

const project = createImageProject();
afterAll(project.cleanup);

const ROUTES = [
  { name: "icon", load: () => import("./icon"), expected: 512 },
  { name: "apple-icon", load: () => import("./apple-icon"), expected: 180 },
];

async function render(route: (typeof ROUTES)[number], logoSquare: string) {
  vi.spyOn(process, "cwd").mockReturnValue(project.dir);
  content.images.logoSquare = logoSquare;
  const mod = await route.load();
  const res = await mod.default();
  return { mod, type: res.headers.get("content-type"), png: Buffer.from(await res.arrayBuffer()) };
}

describe.each(ROUTES)("generated $name", (route) => {
  let blank: Buffer;
  beforeAll(async () => {
    blank = (await render(route, "/images/blank.png")).png; // control: nothing drawn
  });

  it.each(["/images/logo.png", "/images/logo.jpg"])(
    `renders a ${route.expected}px PNG with the logo drawn from %s`,
    async (logo) => {
      const { mod, type, png } = await render(route, logo);
      expect(mod.size).toEqual({ width: route.expected, height: route.expected });
      expect(type).toBe("image/png");
      expect(pngSize(png)).toEqual(mod.size);
      expect(png.equals(blank)).toBe(false);
    },
    20_000
  );

  it("fails the build with a clear message for a WebP logo", async () => {
    await expect(render(route, "/images/webp-named.png")).rejects.toThrow(
      "/images/webp-named.png must be a PNG or JPG image for the site icon."
    );
  });
});

describe("committed square logo", () => {
  // No cwd redirect here (spies are restored after each test): this reads the real public/.
  it.each(ROUTES)("renders the $name from the real content", async (route) => {
    content.images.logoSquare = siteContentFixture().images.logoSquare;
    const mod = await route.load();
    const png = Buffer.from(await (await mod.default()).arrayBuffer());
    expect(pngSize(png)).toEqual(mod.size);
  }, 30_000);
});

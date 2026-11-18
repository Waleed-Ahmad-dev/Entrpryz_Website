import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

/**
 * The project runs ESLint 10. Next.js supports it, but eslint-plugin-react,
 * -jsx-a11y and -import don't list ESLint 10 in their peer ranges yet, so
 * package.json "overrides" points them at the project's ESLint. This test runs
 * the real eslint.config.mjs over code with one known violation per plugin, so a
 * plugin that stops working (or a config that stops loading) fails CI instead of
 * silently linting nothing.
 */
const ROOT = fileURLToPath(new URL("..", import.meta.url));

const PROBE = `
import { useState } from "react";

export function Probe({ items, show }: { items: string[]; show: boolean }) {
  if (show) {
    useState(0); // react-hooks/rules-of-hooks: hook called conditionally
  }
  const unused: any = 1; // @typescript-eslint/no-explicit-any
  return (
    <div>
      <script src="https://example.com/x.js" /> {/* @next/next/no-sync-scripts */}
      {items.map((item) => <p>{item}</p>)} {/* react/jsx-key */}
      <div aria-foo="x" /> {/* jsx-a11y/aria-props */}
    </div>
  );
}

export default () => null; // import/no-anonymous-default-export
`;

describe("ESLint configuration", () => {
  it("loads and reports a violation from every plugin", async () => {
    const eslint = new ESLint({ cwd: ROOT });
    const [result] = await eslint.lintText(PROBE, { filePath: `${ROOT}src/components/lint-probe.tsx` });
    const fatal = result.messages.filter((m) => m.fatal).map((m) => m.message);
    expect(fatal).toEqual([]);

    const rules = new Set(result.messages.map((m) => m.ruleId));
    for (const rule of [
      "@next/next/no-sync-scripts",
      "react-hooks/rules-of-hooks",
      "react/jsx-key",
      "jsx-a11y/aria-props",
      "import/no-anonymous-default-export",
      "@typescript-eslint/no-explicit-any",
    ]) {
      expect(rules, `${rule} was not reported`).toContain(rule);
    }
  }, 60_000);
});

import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { defineConfig } from "vitest/config";

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": fromRoot("./src"),
      // Tests run server code, so resolve `server-only` the way Next.js does on the
      // server (its "react-server" export, an empty module). The default export
      // throws, because it is meant to fail in client bundles.
      "server-only": fromRoot("./node_modules/server-only/empty.js"),
    },
  },
  test: {
    environment: "node",
    // Every test starts from clean mocks; tests set the behaviour they rely on.
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    projects: [
      {
        // `npm test`: fast, offline, run in CI on every push.
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
          exclude: ["src/**/*.live.test.ts"],
        },
      },
      {
        // `npm run test:github`: talks to the real GitHub API with your token.
        // Run by hand only; never in CI. Reads GITHUB_* from .env / .env.local.
        extends: true,
        test: {
          name: "github",
          include: ["src/**/*.live.test.ts"],
          env: githubEnv(),
          testTimeout: 30_000,
        },
      },
    ],
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/app/**/actions.ts", "src/app/api/**"],
      reporter: ["text", "html"],
    },
  },
});

/**
 * GITHUB_* settings for the live test, with Next.js precedence: shell environment,
 * then .env.local, then .env. Only these variables are passed, never the whole file.
 */
function githubEnv(): Record<string, string> {
  const fromFiles: Record<string, string | undefined> = {};
  for (const file of [".env", ".env.local"]) {
    const path = fromRoot(`./${file}`);
    if (existsSync(path)) Object.assign(fromFiles, parseEnv(readFileSync(path, "utf8")));
  }
  const out: Record<string, string> = {};
  for (const key of ["GITHUB_TOKEN", "GITHUB_REPO", "GITHUB_BRANCH"]) {
    const value = process.env[key] || fromFiles[key];
    if (value) out[key] = value;
  }
  return out;
}

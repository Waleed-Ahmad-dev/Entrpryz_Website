import { fileURLToPath } from "node:url";
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
    include: ["src/**/*.test.ts"],
    // Every test starts from clean mocks; tests set the behaviour they rely on.
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/app/**/actions.ts", "src/app/api/**"],
      reporter: ["text", "html"],
    },
  },
});

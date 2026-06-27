import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node", 
    environmentMatchGlobs: [
      ["**/react.test.ts", "jsdom"],
      ["**/react.test.tsx", "jsdom"],
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/types.ts", "src/index.ts"],
    },
  },
  resolve: {
    alias: {
      "gstin-toolkit": new URL("./src/index.ts", import.meta.url).pathname,
    },
  },
});
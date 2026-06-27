// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig([
  // Main library builds (Phase 1, Zod, React)
  {
    entry: ["src/index.ts", "src/zod.ts", "src/react.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    sourcemap: true,
    external: ["zod", "react"],
  },
  // CLI build — separate config, CJS only, with shebang
  {
    entry: { cli: "src/cli.ts" },
    format: ["cjs"],
    dts: false,
    sourcemap: false,
    external: ["zod", "react"],
    banner: {
      js: "#!/usr/bin/env node",
    },
    outExtension: () => ({ js: ".js" }),
  },
]);
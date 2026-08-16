import { spawnSync } from "node:child_process";
import { copyFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outDir = "dist";
const basePath = process.env.PAGES_BASE_PATH ?? "/demo-apps/";

const result = spawnSync(
  process.platform === "win32" ? "cmd.exe" : "pnpm",
  process.platform === "win32"
    ? ["/d", "/s", "/c", `pnpm exec vite build --outDir ${outDir} --base ${basePath} --sourcemap false`]
    : ["exec", "vite", "build", "--outDir", outDir, "--base", basePath, "--sourcemap", "false"],
  {
    env: {
      ...process.env,
      NODE_ENV: "production"
    },
    stdio: "inherit"
  }
);

if (result.status !== 0) {
  if (result.error) {
    console.error(result.error);
  }

  process.exit(result.status ?? 1);
}

await copyFile(join(outDir, "index.html"), join(outDir, "404.html"));
await writeFile(join(outDir, ".nojekyll"), "");

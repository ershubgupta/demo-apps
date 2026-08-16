import { spawnSync } from "node:child_process";
import { copyFile, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

const outDir = process.env.PAGES_OUT_DIR ?? "docs";
const basePath = process.env.PAGES_BASE_PATH ?? "/demo-apps/";
const artifactDir = "release-artifacts/release-map-pages";

await rm(artifactDir, { force: true, recursive: true });

const result = spawnSync(
  process.platform === "win32" ? "cmd.exe" : "pnpm",
  process.platform === "win32"
    ? ["/d", "/s", "/c", `pnpm exec vite build --outDir ${outDir} --base ${basePath} --sourcemap hidden`]
    : ["exec", "vite", "build", "--outDir", outDir, "--base", basePath, "--sourcemap", "hidden"],
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

const movedMaps = await moveMaps(outDir, artifactDir);
await writeFile(
  join(artifactDir, "MAP_MANIFEST.json"),
  `${JSON.stringify(
    {
      release: "github-pages",
      publicDirectory: outDir,
      artifactDirectory: artifactDir,
      maps: movedMaps
    },
    null,
    2
  )}\n`
);

console.log(`Moved ${movedMaps.length} GitHub Pages source map file(s) to ${artifactDir}`);

async function moveMaps(publicDirectory, artifactDirectory) {
  const maps = [];

  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const absolute = join(directory, entry.name);

      if (entry.isDirectory()) {
        await visit(absolute);
        continue;
      }

      if (!entry.name.endsWith(".map")) {
        continue;
      }

      const relativePath = relative(publicDirectory, absolute);
      const artifactPath = join(artifactDirectory, relativePath);
      await mkdir(dirname(artifactPath), { recursive: true });
      await copyFile(absolute, artifactPath);
      await rm(absolute);
      maps.push({
        publicPath: relativePath.replaceAll("\\", "/"),
        artifactPath: relative(artifactDirectory, artifactPath).replaceAll("\\", "/"),
        bytes: (await stat(artifactPath)).size
      });
    }
  }

  await visit(publicDirectory);
  return maps;
}

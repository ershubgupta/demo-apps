import { spawnSync } from "node:child_process";
import { copyFile, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

const release = process.argv[2];

const releases = {
  "public-map": {
    label: "release-map-public",
    outDir: "dist-public-map",
    sourcemap: true
  },
  "private-map": {
    label: "release-map-private",
    outDir: "dist-private-public",
    artifactDir: "release-artifacts/release-map-private",
    sourcemap: "hidden"
  },
  "no-map": {
    label: "release-no-map",
    outDir: "dist-no-map",
    sourcemap: false
  }
};

const config = releases[release];

if (!config) {
  console.error("Usage: node scripts/build-release.mjs <public-map|private-map|no-map>");
  process.exit(1);
}

if (config.artifactDir) {
  await rm(config.artifactDir, { force: true, recursive: true });
}

const result = spawnSync(
  process.platform === "win32" ? "cmd.exe" : "pnpm",
  process.platform === "win32"
    ? ["/d", "/s", "/c", `pnpm exec vite build --outDir ${config.outDir} ${getSourcemapFlag(config.sourcemap)}`]
    : ["exec", "vite", "build", "--outDir", config.outDir, ...getSourcemapArgs(config.sourcemap)],
  {
    env: {
      ...process.env,
      NODE_ENV: "production",
      VITE_RELEASE_LABEL: config.label
    },
    stdio: "inherit"
  }
);

if (result.status !== 0) {
  if (result.error) {
    console.error(result.error);
  }

  console.error(`Vite build process exited with status ${result.status}`);
  process.exit(result.status ?? 1);
}

function getSourcemapFlag(sourcemap) {
  if (sourcemap === true) {
    return "--sourcemap true";
  }

  if (sourcemap === "hidden") {
    return "--sourcemap hidden";
  }

  return "--sourcemap false";
}

function getSourcemapArgs(sourcemap) {
  if (sourcemap === true) {
    return ["--sourcemap", "true"];
  }

  if (sourcemap === "hidden") {
    return ["--sourcemap", "hidden"];
  }

  return ["--sourcemap", "false"];
}

if (config.artifactDir) {
  const movedMaps = await moveMaps(config.outDir, config.artifactDir);
  await writeFile(
    join(config.artifactDir, "MAP_MANIFEST.json"),
    `${JSON.stringify(
      {
        release: config.label,
        publicDirectory: config.outDir,
        artifactDirectory: config.artifactDir,
        maps: movedMaps
      },
      null,
      2
    )}\n`
  );
  console.log(`Moved ${movedMaps.length} source map file(s) to ${config.artifactDir}`);
}

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
        artifactPath: relative(config.artifactDir, artifactPath).replaceAll("\\", "/"),
        bytes: (await stat(artifactPath)).size
      });
    }
  }

  await visit(publicDirectory);
  return maps;
}

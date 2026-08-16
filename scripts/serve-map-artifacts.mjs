import { createServer } from "node:http";
import { resolve } from "node:path";
import { serveStaticFile } from "./server-utils.mjs";

const rootDirectory = process.argv[2];
const host = "127.0.0.1";
const port = Number(process.env.MAP_PORT ?? 4174);

if (!rootDirectory) {
  console.error("Usage: node scripts/serve-map-artifacts.mjs <artifact-directory>");
  process.exit(1);
}

const absoluteRoot = resolve(rootDirectory);

const server = createServer((request, response) => {
  void serveStaticFile(request, response, absoluteRoot, {
    cacheControl: "no-store",
    cors: true
  });
});

server.listen(port, host, () => {
  console.log(`Serving private source maps from ${absoluteRoot}`);
  console.log(`Map artifact URL root: http://${host}:${port}`);
});

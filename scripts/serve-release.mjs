import { createServer } from "node:http";
import { resolve } from "node:path";
import { handleApiRequest, serveStaticFile } from "./server-utils.mjs";

const rootDirectory = process.argv[2];
const host = "127.0.0.1";
const port = Number(process.env.PORT ?? 4173);

if (!rootDirectory) {
  console.error("Usage: node scripts/serve-release.mjs <dist-directory>");
  process.exit(1);
}

const absoluteRoot = resolve(rootDirectory);

const server = createServer((request, response) => {
  if (handleApiRequest(request, response)) {
    return;
  }

  void serveStaticFile(request, response, absoluteRoot);
});

server.listen(port, host, () => {
  console.log(`Serving ${absoluteRoot}`);
  console.log(`Demo production URL: http://${host}:${port}`);
});

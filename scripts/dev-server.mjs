import { createServer as createHttpServer } from "node:http";
import { createServer as createViteServer } from "vite";
import { handleApiRequest } from "./server-utils.mjs";

const host = "127.0.0.1";
const port = Number(process.env.PORT ?? 5173);
const hmrPort = Number(process.env.HMR_PORT ?? port + 10000);

const vite = await createViteServer({
  server: {
    hmr: {
      host,
      port: hmrPort
    },
    middlewareMode: true
  },
  appType: "spa"
});

const server = createHttpServer((request, response) => {
  if (handleApiRequest(request, response)) {
    return;
  }

  vite.middlewares(request, response);
});

server.listen(port, host, () => {
  console.log(`Demo dev server: http://${host}:${port}`);
  console.log(`Vite HMR websocket: ws://${host}:${hmrPort}`);
});

server.on("error", (error) => {
  if (error && typeof error === "object" && "code" in error && error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Stop the existing demo server or run with PORT=5174.`);
    void vite.close();
    process.exit(1);
  }

  throw error;
});

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

async function registerDemoApiMock() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    await navigator.serviceWorker.register(
      `${import.meta.env.BASE_URL}mock-api-sw.js`,
      { scope: import.meta.env.BASE_URL }
    );
    await navigator.serviceWorker.ready;
  } catch {
    // Local development still has the Node mock endpoint as a fallback.
  }
}

async function bootstrap() {
  await registerDemoApiMock();

  createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

void bootstrap();

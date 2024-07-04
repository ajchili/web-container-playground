import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen.js";
import "./index.css";

let $app = document.querySelector("div#app");

if (!$app) {
  $app = document.createElement("div");
  document.body.appendChild($app);
}

const router = createRouter({ routeTree });

const root = createRoot($app);
root.render(
  // TODO: Figure out initial load bug where initial page render double renders component
  // https://github.com/TanStack/router/issues/861
  // <StrictMode>
  <RouterProvider router={router} />,
  // </StrictMode>,
);

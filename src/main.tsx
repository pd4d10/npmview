import "uno.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "github-fork-ribbon-css/gh-fork-ribbon.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

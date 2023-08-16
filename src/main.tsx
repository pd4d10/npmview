import "uno.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "github-fork-ribbon-css/gh-fork-ribbon.css";
import { StrictMode } from "react";
import { make as App } from "./App.bs.js";
import { createRoot } from "react-dom/client";

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

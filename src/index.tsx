import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "normalize.css/normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "github-fork-ribbon-css/gh-fork-ribbon.css";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

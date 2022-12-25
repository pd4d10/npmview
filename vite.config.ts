import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import rescript from "@jihchi/vite-plugin-rescript";

export default defineConfig({
  plugins: [react(), rescript()],
});

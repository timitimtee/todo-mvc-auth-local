import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "frontend",
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/login": "http://localhost:2121",
      "/logout": "http://localhost:2121",
      "/signup": "http://localhost:2121",
      "/todos": "http://localhost:2121",
    },
  },
});

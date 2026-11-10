import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" keeps asset paths relative, so the build works from any folder or Pages path later.
export default defineConfig({
  base: "./",
  plugins: [react()],
  // The two review pages ship alongside the prototype.
  build: { rollupOptions: { input: { main: "index.html", links: "links.html", motion: "motion.html" } } },
  server: { port: 5196, strictPort: true },
});

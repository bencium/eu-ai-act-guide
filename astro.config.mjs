import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://aiact.bencium.io",
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory"
  },
  vite: {
    build: {
      target: "es2022"
    }
  }
});

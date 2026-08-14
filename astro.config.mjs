import { defineConfig } from "astro/config";

export default defineConfig({
  // The production domain is supplied via SITE_URL (Vercel env + GitHub
  // Actions repository variable) so it never appears in the repository.
  site: process.env.SITE_URL ?? "http://localhost:4321",
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

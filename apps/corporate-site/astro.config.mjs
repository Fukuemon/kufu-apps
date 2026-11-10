// @ts-check
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  compressHTML: true,
  integrations: [react()],
  vite: {
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [tailwindcss()],
  },
});

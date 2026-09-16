// @ts-check
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { shouldIncludeInSitemap } from "./src/lib/seo.ts";

// https://astro.build/config
export default defineConfig({
  // Custom domain served via GitHub Pages (see issue #3).
  site: "https://squirrels.team",
  integrations: [
    sitemap({
      filter: shouldIncludeInSitemap,
    }),
  ],
});

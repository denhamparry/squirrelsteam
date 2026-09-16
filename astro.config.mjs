// @ts-check
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import {
  findUnmatchedNoindexPaths,
  shouldIncludeInSitemap,
} from "./src/lib/seo.ts";

// https://astro.build/config
export default defineConfig({
  // Custom domain served via GitHub Pages (see issue #3).
  site: "https://squirrels.team",
  integrations: [
    {
      name: "validate-noindex-paths",
      hooks: {
        "astro:build:done": ({ pages }) => {
          const unmatchedPaths = findUnmatchedNoindexPaths(
            pages.map(({ pathname }) => pathname),
          );

          if (unmatchedPaths.length > 0) {
            throw new Error(
              `NOINDEX_PATHS entries match no generated page: ${unmatchedPaths.map((pathname) => JSON.stringify(pathname)).join(", ")}.`,
            );
          }
        },
      },
    },
    sitemap({
      filter: shouldIncludeInSitemap,
    }),
  ],
});

import type { APIRoute } from "astro";
import { getFixtures } from "../lib/fixtures";
import { fixtureWarnings } from "../lib/fixture-checks";
import { buildCalendar } from "../lib/ics";

// Build-time endpoint → /fixtures.ics (RFC 5545). Prerendered with the static
// output, so the feed is a plain file on the CDN.
export const GET: APIRoute = async () => {
  const fixtures = await getFixtures();
  // Non-fatal data warnings (#300), printed once per build.
  for (const { id, data } of fixtures) {
    for (const warning of fixtureWarnings(data)) {
      console.warn(`[fixtures] ${id}: ${warning}`);
    }
  }
  const body = buildCalendar(fixtures);

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="fixtures.ics"',
    },
  });
};

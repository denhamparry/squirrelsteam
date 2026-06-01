import type { APIRoute } from "astro";
import { getFixtures } from "../lib/fixtures";
import { buildCalendar } from "../lib/ics";

// Build-time endpoint → /fixtures.ics (RFC 5545). Prerendered with the static
// output, so the feed is a plain file on the CDN.
export const GET: APIRoute = async () => {
  const fixtures = await getFixtures();
  const body = buildCalendar(fixtures);

  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="fixtures.ics"',
    },
  });
};

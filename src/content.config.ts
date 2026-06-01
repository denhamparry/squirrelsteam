import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Fixtures live as markdown files in src/content/fixtures/ and are built into
// the /fixtures.ics calendar feed (see src/lib/ics.ts) and the Fixtures page.
const fixtures = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/fixtures" }),
  schema: z.object({
    title: z.string(),
    type: z.enum(["match", "training", "tour", "social", "fundraiser"]),
    // Coerce ISO strings to Date. A date-only string ("2026-07-04") parses as
    // UTC midnight; an offset string ("...+01:00") parses to the right instant.
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    // For all-day events `end` is the LAST day (inclusive). The .ics generator
    // emits the RFC-required exclusive DTEND (last day + 1) automatically.
    allDay: z.boolean().default(false),
    location: z.string().optional(),
    opponent: z.string().optional(),
    home: z.boolean().optional(),
    // Optional RFC 5545 recurrence rule, e.g. "FREQ=WEEKLY;BYDAY=TU;UNTIL=...".
    rrule: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { fixtures };

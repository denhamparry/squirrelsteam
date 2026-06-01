import { getCollection, type CollectionEntry } from "astro:content";

export type Fixture = CollectionEntry<"fixtures">;
export type FixtureType = Fixture["data"]["type"];

const TIME_ZONE = "Europe/London";

const TYPE_LABELS: Record<FixtureType, string> = {
  match: "Match",
  training: "Training",
  tour: "Tour",
  social: "Social",
  fundraiser: "Fundraiser",
};

export function typeLabel(type: FixtureType): string {
  return TYPE_LABELS[type];
}

/** All published fixtures (drafts excluded), sorted by start ascending. */
export async function getFixtures(): Promise<Fixture[]> {
  const entries = await getCollection("fixtures", ({ data }) => !data.draft);
  return entries.sort(
    (a, b) => a.data.start.getTime() - b.data.start.getTime(),
  );
}

/** Parse the UNTIL date out of an RRULE (e.g. "...;UNTIL=20260825T180000Z"). */
function parseUntil(rrule: string): Date | null {
  const match = /UNTIL=(\d{8})(?:T(\d{6})Z?)?/.exec(rrule);
  if (!match) return null;
  const [, date, time] = match;
  const iso =
    `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}` +
    (time
      ? `T${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)}Z`
      : "T00:00:00Z");
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** The instant a fixture stops being "current": its RRULE UNTIL, else end/start. */
function effectiveEnd(f: Fixture): Date {
  const until = f.data.rrule ? parseUntil(f.data.rrule) : null;
  return until ?? f.data.end ?? f.data.start;
}

/** Fixtures that have not yet finished, soonest first. */
export async function getUpcomingFixtures(
  now: Date = new Date(),
): Promise<Fixture[]> {
  const fixtures = await getFixtures();
  return fixtures.filter((f) => effectiveEnd(f).getTime() >= now.getTime());
}

/** Fixtures that have finished, most recent first. */
export async function getPastFixtures(
  now: Date = new Date(),
): Promise<Fixture[]> {
  const fixtures = await getFixtures();
  return fixtures
    .filter((f) => effectiveEnd(f).getTime() < now.getTime())
    .reverse();
}

// All-day dates are stored as UTC midnight, so format them in UTC to avoid a
// timezone shift; timed events format in Europe/London.
const allDayDateFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const dateFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: TIME_ZONE,
});
const timeFmt = new Intl.DateTimeFormat("en-GB", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: TIME_ZONE,
});

const untilDateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: TIME_ZONE,
});

const DAY_NAMES: Record<string, string> = {
  MO: "Monday",
  TU: "Tuesday",
  WE: "Wednesday",
  TH: "Thursday",
  FR: "Friday",
  SA: "Saturday",
  SU: "Sunday",
};

function listDays(codes: string[]): string {
  const plural = codes.map((c) => `${DAY_NAMES[c] ?? c}s`);
  if (plural.length <= 1) return plural[0] ?? "";
  return `${plural.slice(0, -1).join(", ")} and ${plural[plural.length - 1]}`;
}

/**
 * Human-friendly recurrence summary for an RRULE, e.g.
 * "Weekly on Tuesdays, until 25 Aug 2026". Returns null if it can't be parsed.
 */
export function recurrenceText(rrule: string): string | null {
  const parts = Object.fromEntries(
    rrule
      .split(";")
      .map((part) => part.split("="))
      .filter((pair): pair is [string, string] => pair.length === 2),
  );
  const freq = parts.FREQ;
  if (!freq) return null;

  const days = parts.BYDAY ? parts.BYDAY.split(",") : [];
  let cadence: string;
  switch (freq) {
    case "DAILY":
      cadence = "Daily";
      break;
    case "WEEKLY":
      cadence = days.length ? `Weekly on ${listDays(days)}` : "Weekly";
      break;
    case "MONTHLY":
      cadence = "Monthly";
      break;
    case "YEARLY":
      cadence = "Yearly";
      break;
    default:
      cadence = freq.toLowerCase();
  }

  const until = parseUntil(rrule);
  return until ? `${cadence}, until ${untilDateFmt.format(until)}` : cadence;
}

function sameUtcDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

/** Human-friendly "when" string for display (Europe/London). */
export function formatWhen(f: Fixture): string {
  const { start, end, allDay } = f.data;

  if (allDay) {
    if (end && !sameUtcDay(start, end)) {
      return `${allDayDateFmt.format(start)} – ${allDayDateFmt.format(end)}`;
    }
    return allDayDateFmt.format(start);
  }

  const day = dateFmt.format(start);
  const startTime = timeFmt.format(start);
  if (end) {
    return `${day}, ${startTime}–${timeFmt.format(end)}`;
  }
  return `${day}, ${startTime}`;
}

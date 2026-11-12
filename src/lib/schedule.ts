// Pure date helpers for fixtures: when a fixture stops being current, the next
// session of a recurring fixture, and display strings. No astro:content import,
// so this module can be unit tested with plain objects (see test/).
import { nextOccurrence, parseUntil, type Occurrence } from "./recurrence";

export type { Occurrence } from "./recurrence";

const TIME_ZONE = "Europe/London";

/** The fields of a fixture these helpers read. Fixture entries satisfy it. */
export interface Scheduled {
  data: {
    start: Date;
    end?: Date;
    allDay?: boolean;
    rrule?: string;
    exdates?: Date[];
    result?: unknown;
  };
}

/**
 * The instant a fixture stops being "current": its RRULE UNTIL, else end/start.
 * All-day dates are stored as UTC midnight of their (inclusive) last day, so
 * they stay current until that day is over rather than dropping off "Next up"
 * on the morning of the game. A recorded result means the match is over, so it
 * moves to Results on the next build that day.
 */
export function effectiveEnd(f: Scheduled): Date {
  if (f.data.result) return f.data.start;
  const until = f.data.rrule ? parseUntil(f.data.rrule) : null;
  if (until) return until;
  const end = f.data.end ?? f.data.start;
  return f.data.allDay ? new Date(end.getTime() + 86_400_000) : end;
}

/**
 * The next session of a recurring fixture that hasn't finished by `now`, or
 * null for one-off fixtures, finished series and rules we can't expand.
 */
export function upcomingOccurrence(
  f: Scheduled,
  now: Date = new Date(),
): Occurrence | null {
  if (!f.data.rrule) return null;
  return nextOccurrence(
    f.data.start,
    f.data.end,
    f.data.rrule,
    now,
    f.data.exdates,
  );
}

/** True until a fixture has finished (see effectiveEnd). */
export function isUpcoming(f: Scheduled, now: Date): boolean {
  return effectiveEnd(f).getTime() >= now.getTime();
}

/** Sort key for upcoming lists: a recurring fixture's next session, else start. */
export function upcomingSortKey(f: Scheduled, now: Date): number {
  return (upcomingOccurrence(f, now)?.start ?? f.data.start).getTime();
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

/**
 * Human-friendly "when" string for display (Europe/London). Pass an
 * occurrence to format one session of a recurring fixture instead of its first.
 */
export function formatWhen(f: Scheduled, occurrence?: Occurrence): string {
  const { allDay } = f.data;
  const start = occurrence?.start ?? f.data.start;
  const end = occurrence ? occurrence.end : f.data.end;

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

/**
 * Whether a date-only day (stored as UTC midnight, like all-day fixtures) is
 * over by `now`. The day itself still counts as current.
 */
export function isPastDay(day: Date, now: Date): boolean {
  return now.getTime() >= day.getTime() + 86_400_000;
}

const longDateFmt = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** A date-only day in full, e.g. "Monday 2 November 2026". */
export function formatLongDate(day: Date): string {
  return longDateFmt.format(day).replace(",", "");
}

/** A timed event's London date, e.g. "Tue, 22 Dec 2026". */
export function formatDay(instant: Date): string {
  return dateFmt.format(instant);
}

// Dependency-free helpers for the simple recurrence rules fixtures use
// (FREQ=WEEKLY or DAILY, optional BYDAY and UNTIL). Occurrences keep the first
// session's Europe/London wall-clock time across the clock change, matching how
// calendar clients expand the RRULE with DTSTART;TZID=Europe/London.

const TIME_ZONE = "Europe/London";
const DAY_MS = 86_400_000;
// Far enough ahead to find the next weekly session; bounds the search loop.
const SEARCH_DAYS = 370;

const WEEKDAY_CODES = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"] as const;

const londonParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hourCycle: "h23",
});

interface WallClock {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface Occurrence {
  start: Date;
  end?: Date;
}

function toWallClock(d: Date): WallClock {
  const parts = Object.fromEntries(
    londonParts
      .formatToParts(d)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, Number(value)]),
  );
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
  };
}

/** Offset of Europe/London from UTC at an instant, in milliseconds. */
function londonOffset(instant: number): number {
  const w = toWallClock(new Date(instant));
  const asUtc = Date.UTC(
    w.year,
    w.month - 1,
    w.day,
    w.hour,
    w.minute,
    w.second,
  );
  return asUtc - Math.floor(instant / 1000) * 1000;
}

/** The instant a Europe/London wall-clock time occurs (day may overflow). */
function fromWallClock(w: WallClock): Date {
  const asUtc = Date.UTC(
    w.year,
    w.month - 1,
    w.day,
    w.hour,
    w.minute,
    w.second,
  );
  // Two passes settle the offset either side of a clock change.
  let instant = asUtc - londonOffset(asUtc);
  instant = asUtc - londonOffset(instant);
  return new Date(instant);
}

function parseRule(rrule: string): Record<string, string> {
  return Object.fromEntries(
    rrule
      .split(";")
      .map((part) => part.split("="))
      .filter((pair): pair is [string, string] => pair.length === 2),
  );
}

/** Parse the UNTIL date out of an RRULE (e.g. "...;UNTIL=20260825T180000Z"). */
export function parseUntil(rrule: string): Date | null {
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

/**
 * The first occurrence of a recurring event that has not finished by `now`
 * (an in-progress session counts), skipping any `exdates`. Returns null when the series is over or the
 * rule uses features this helper doesn't model (INTERVAL > 1, COUNT, or a
 * FREQ other than WEEKLY/DAILY), so callers can fall back to the series start.
 */
export function nextOccurrence(
  start: Date,
  end: Date | undefined,
  rrule: string,
  now: Date,
  exdates: readonly Date[] = [],
): Occurrence | null {
  const skipped = new Set(exdates.map((d) => d.getTime()));
  const rule = parseRule(rrule);
  if (rule.FREQ !== "WEEKLY" && rule.FREQ !== "DAILY") return null;
  if (rule.COUNT || (rule.INTERVAL && rule.INTERVAL !== "1")) return null;

  const first = toWallClock(start);
  const firstDay = Date.UTC(first.year, first.month - 1, first.day);
  const days = new Set(
    rule.BYDAY
      ? rule.BYDAY.split(",")
      : rule.FREQ === "WEEKLY"
        ? [WEEKDAY_CODES[new Date(firstDay).getUTCDay()]]
        : WEEKDAY_CODES,
  );
  const until = parseUntil(rrule);
  const duration = end ? end.getTime() - start.getTime() : 0;

  // Start searching the day before `now` (in London) so an evening session
  // that is still running is found, but never before the first session.
  const today = toWallClock(now);
  const todayDay = Date.UTC(today.year, today.month - 1, today.day);
  const fromOffset = Math.max(
    0,
    Math.round((todayDay - firstDay) / DAY_MS) - 1,
  );

  for (let offset = fromOffset; offset < fromOffset + SEARCH_DAYS; offset++) {
    const weekday =
      WEEKDAY_CODES[new Date(firstDay + offset * DAY_MS).getUTCDay()];
    if (!days.has(weekday)) continue;

    const occStart = fromWallClock({ ...first, day: first.day + offset });
    if (occStart.getTime() < start.getTime()) continue;
    if (until && occStart.getTime() > until.getTime()) return null;
    if (skipped.has(occStart.getTime())) continue;

    const occEnd = end ? new Date(occStart.getTime() + duration) : undefined;
    if ((occEnd ?? occStart).getTime() >= now.getTime()) {
      return { start: occStart, end: occEnd };
    }
  }
  return null;
}

/**
 * Whether `date` is exactly one of the series' sessions: on a BYDAY weekday,
 * at the first session's Europe/London wall-clock time, between the start and
 * UNTIL. An EXDATE that isn't is silently ignored by calendar clients, so the
 * content schema rejects it (#297).
 */
export function isOccurrence(start: Date, rrule: string, date: Date): boolean {
  const rule = parseRule(rrule);
  if (rule.FREQ !== "WEEKLY" && rule.FREQ !== "DAILY") return false;
  const until = parseUntil(rrule);
  if (date.getTime() < start.getTime()) return false;
  if (until && date.getTime() > until.getTime()) return false;

  const first = toWallClock(start);
  const candidate = toWallClock(date);
  if (
    candidate.hour !== first.hour ||
    candidate.minute !== first.minute ||
    candidate.second !== first.second
  ) {
    return false;
  }
  const weekday =
    WEEKDAY_CODES[
      new Date(
        Date.UTC(candidate.year, candidate.month - 1, candidate.day),
      ).getUTCDay()
    ];
  const firstWeekday =
    WEEKDAY_CODES[
      new Date(Date.UTC(first.year, first.month - 1, first.day)).getUTCDay()
    ];
  const days = rule.BYDAY
    ? rule.BYDAY.split(",")
    : rule.FREQ === "WEEKLY"
      ? [firstWeekday]
      : [...WEEKDAY_CODES];
  return days.includes(weekday);
}

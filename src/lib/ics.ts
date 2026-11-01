import type { CollectionEntry } from "astro:content";
import { formatResult } from "./fixtures";

// Dependency-free RFC 5545 (iCalendar) generator for the fixtures feed.
// Output uses CRLF line endings, 75-octet line folding, Europe/London local
// times for timed events (with a VTIMEZONE so recurring events keep their wall
// clock time across DST), and exclusive all-day DTEND values — the things real
// calendar clients are picky about.

type Fixture = CollectionEntry<"fixtures">;

const UID_DOMAIN = "squirrels.team";
const TZID = "Europe/London";

// RFC 5545 VTIMEZONE for Europe/London (current EU rules since 1996): BST
// starts at 01:00 GMT on the last Sunday of March and ends at 01:00 GMT
// (02:00 BST) on the last Sunday of October.
const VTIMEZONE_LINES = [
  "BEGIN:VTIMEZONE",
  `TZID:${TZID}`,
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0000",
  "TZOFFSETTO:+0100",
  "TZNAME:BST",
  "DTSTART:19810329T010000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0000",
  "TZNAME:GMT",
  "DTSTART:19961027T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

const londonParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZID,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function pad(n: number, len = 2): string {
  return String(n).padStart(len, "0");
}

/** UTC date-time stamp: YYYYMMDDTHHMMSSZ. */
function toUtcStamp(d: Date): string {
  return (
    pad(d.getUTCFullYear(), 4) +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

/** Europe/London local date-time: YYYYMMDDTHHMMSS (paired with TZID). */
function toLondonStamp(d: Date): string {
  const parts = Object.fromEntries(
    londonParts.formatToParts(d).map(({ type, value }) => [type, value]),
  );
  return (
    `${parts.year}${parts.month}${parts.day}` +
    `T${parts.hour}${parts.minute}${parts.second}`
  );
}

/** UTC date value: YYYYMMDD (for all-day VALUE=DATE properties). */
function toUtcDate(d: Date): string {
  return (
    pad(d.getUTCFullYear(), 4) + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate())
  );
}

/** Add one calendar day in UTC (24h) — used for the exclusive all-day DTEND. */
function addUtcDay(d: Date): Date {
  return new Date(d.getTime() + 86_400_000);
}

/** Escape text per RFC 5545 §3.3.11. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Fold a content line to 75 octets (RFC 5545 §3.1). Continuation lines are
 * prefixed with a single space (which counts toward the 75-octet limit), and a
 * multi-byte UTF-8 character is never split across a fold boundary.
 */
function foldLine(line: string): string {
  const encoder = new TextEncoder();
  const segments: string[] = [];
  let current = "";
  let currentBytes = 0;
  let limit = 75; // first line; continuation lines lose one octet to the space
  for (const ch of Array.from(line)) {
    const chBytes = encoder.encode(ch).length;
    if (currentBytes + chBytes > limit) {
      segments.push(current);
      current = ch;
      currentBytes = chBytes;
      limit = 74;
    } else {
      current += ch;
      currentBytes += chBytes;
    }
  }
  segments.push(current);
  return segments.join("\r\n ");
}

function eventSummary(data: Fixture["data"]): string {
  if (!data.cup) return data.title;

  const gamedayPrefix = "#1415 Gameday:";
  return data.title.startsWith(gamedayPrefix)
    ? `#1415 Cup:${data.title.slice(gamedayPrefix.length)}`
    : `Cup: ${data.title}`;
}

function eventLines(entry: Fixture, dtstamp: string): string[] {
  const { data, id } = entry;
  const lines = [
    "BEGIN:VEVENT",
    `UID:${id}@${UID_DOMAIN}`,
    `DTSTAMP:${dtstamp}`,
  ];

  if (data.allDay) {
    // DTEND is exclusive: `end` is the inclusive last day, so emit last day + 1.
    const endExclusive = addUtcDay(data.end ?? data.start);
    lines.push(`DTSTART;VALUE=DATE:${toUtcDate(data.start)}`);
    lines.push(`DTEND;VALUE=DATE:${toUtcDate(endExclusive)}`);
  } else {
    // Local time + TZID, not UTC: an RRULE repeats DTSTART's wall-clock time
    // in its zone, so a UTC DTSTART would drift by an hour across DST. RRULE
    // UNTIL stays in UTC, as RFC 5545 requires alongside a TZID DTSTART.
    lines.push(`DTSTART;TZID=${TZID}:${toLondonStamp(data.start)}`);
    if (data.end) {
      lines.push(`DTEND;TZID=${TZID}:${toLondonStamp(data.end)}`);
    }
  }

  lines.push(`SUMMARY:${escapeText(eventSummary(data))}`);

  if (data.location) {
    lines.push(`LOCATION:${escapeText(data.location)}`);
  }

  // Prefer the fixture's own notes; otherwise synthesise a match description.
  // A structured result is appended independently so calendars retain notes.
  const note = entry.body?.trim();
  const description: string[] = [];
  if (note) {
    description.push(note);
  } else if (data.type === "match" && data.opponent) {
    const side = data.home === undefined ? "" : data.home ? "Home" : "Away";
    const desc = [side, `vs ${data.opponent}`].filter(Boolean).join(" match ");
    description.push(desc);
  }

  const result = formatResult(data);
  if (result) {
    description.push(`Result: ${result}`);
  }
  if (description.length > 0) {
    lines.push(`DESCRIPTION:${escapeText(description.join("\n"))}`);
  }

  if (data.rrule) {
    lines.push(`RRULE:${data.rrule}`);
  }

  lines.push("END:VEVENT");
  return lines;
}

/** Build a complete VCALENDAR document from fixture entries. */
export function buildCalendar(
  entries: Fixture[],
  dtstamp: string = toUtcStamp(new Date()),
): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//squirrels.team//Fixtures//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Rhiwbina Squirrels U12 Fixtures",
    `X-WR-TIMEZONE:${TZID}`,
    ...VTIMEZONE_LINES,
  ];
  for (const entry of entries) {
    lines.push(...eventLines(entry, dtstamp));
  }
  lines.push("END:VCALENDAR");
  return lines.map(foldLine).join("\r\n") + "\r\n";
}

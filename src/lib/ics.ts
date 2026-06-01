import type { CollectionEntry } from "astro:content";

// Dependency-free RFC 5545 (iCalendar) generator for the fixtures feed.
// Output uses CRLF line endings, 75-octet line folding, UTC timestamps, and
// exclusive all-day DTEND values — the things real calendar clients are picky
// about.

type Fixture = CollectionEntry<"fixtures">;

const UID_DOMAIN = "squirrels.team";

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
    lines.push(`DTSTART:${toUtcStamp(data.start)}`);
    if (data.end) {
      lines.push(`DTEND:${toUtcStamp(data.end)}`);
    }
  }

  lines.push(`SUMMARY:${escapeText(data.title)}`);

  if (data.location) {
    lines.push(`LOCATION:${escapeText(data.location)}`);
  }

  if (data.type === "match" && data.opponent) {
    const side = data.home === undefined ? "" : data.home ? "Home" : "Away";
    const desc = [side, `vs ${data.opponent}`].filter(Boolean).join(" match ");
    lines.push(`DESCRIPTION:${escapeText(desc)}`);
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
    "X-WR-TIMEZONE:Europe/London",
  ];
  for (const entry of entries) {
    lines.push(...eventLines(entry, dtstamp));
  }
  lines.push("END:VCALENDAR");
  return lines.map(foldLine).join("\r\n") + "\r\n";
}

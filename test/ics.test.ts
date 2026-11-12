import assert from "node:assert/strict";
import { test } from "node:test";
import { buildCalendar } from "../src/lib/ics";
import { fixture } from "./helpers";

const STAMP = "20261112T000000Z";
const calendar = (...entries: Parameters<typeof fixture>[]) =>
  buildCalendar(
    entries.map((args) => fixture(...args)),
    STAMP,
  );
const lines = (ics: string) => ics.split("\r\n");
/** Content lines with RFC 5545 folding undone. */
const unfolded = (ics: string) => lines(ics.replace(/\r\n /g, ""));

test("uses CRLF line endings and wraps events in a VCALENDAR", () => {
  const ics = calendar(["a", { title: "A", start: new Date("2026-11-22") }]);
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
  assert.ok(!/[^\r]\n/.test(ics), "every LF is preceded by CR");
  assert.ok(lines(ics).includes("UID:a@squirrels.team"));
});

test("folds long lines at 75 octets without splitting multi-byte characters", () => {
  const title = `${"x".repeat(70)}🏉🏉 Llanelli Wanderers — Dydd Sul`;
  const ics = calendar(["long", { title, start: new Date("2026-11-22") }]);
  const encoder = new TextEncoder();
  for (const line of lines(ics)) {
    assert.ok(encoder.encode(line).length <= 75, `line too long: ${line}`);
  }
  assert.ok(unfolded(ics).includes(`SUMMARY:${title}`));
});

test("escapes commas, semicolons, backslashes and newlines in text", () => {
  const ics = calendar([
    "esc",
    { title: "A, B; C\\D", start: new Date("2026-11-22") },
    "Line one\nLine two",
  ]);
  const out = unfolded(ics);
  assert.ok(out.includes("SUMMARY:A\\, B\\; C\\\\D"));
  assert.ok(out.includes("DESCRIPTION:Line one\\nLine two"));
});

test("timed events use Europe/London local time in GMT and BST", () => {
  const ics = calendar(
    [
      "gmt",
      {
        title: "GMT",
        start: new Date("2026-11-29T10:00:00+00:00"),
        end: new Date("2026-11-29T12:00:00+00:00"),
      },
    ],
    ["bst", { title: "BST", start: new Date("2027-04-25T10:00:00+01:00") }],
  );
  const out = lines(ics);
  assert.ok(out.includes("DTSTART;TZID=Europe/London:20261129T100000"));
  assert.ok(out.includes("DTEND;TZID=Europe/London:20261129T120000"));
  assert.ok(out.includes("DTSTART;TZID=Europe/London:20270425T100000"));
  assert.ok(out.includes("BEGIN:VTIMEZONE"));
});

test("all-day events end the day after their last day", () => {
  const ics = calendar([
    "tour",
    {
      title: "Tour",
      type: "tour",
      allDay: true,
      start: new Date("2027-05-01"),
      end: new Date("2027-05-04"),
    },
  ]);
  const out = lines(ics);
  assert.ok(out.includes("DTSTART;VALUE=DATE:20270501"));
  assert.ok(out.includes("DTEND;VALUE=DATE:20270505"));
});

test("cup fixtures swap the Gameday prefix for Cup", () => {
  const ics = calendar([
    "cup",
    {
      title: "#1415 Gameday: Ynysowen (Home)",
      cup: true,
      start: new Date("2026-09-13"),
    },
  ]);
  assert.ok(lines(ics).includes("SUMMARY:#1415 Cup: Ynysowen (Home)"));
});

test("descriptions prefer notes, else describe the match, then add the result", () => {
  const ics = calendar(
    [
      "note",
      {
        title: "N",
        start: new Date("2026-11-15"),
        opponent: "Rumney RFC",
        home: true,
      },
      "Meet 10:30am.",
    ],
    [
      "gen",
      {
        title: "G",
        start: new Date("2027-02-14"),
        opponent: "Whitchurch",
        home: false,
      },
    ],
    [
      "res",
      {
        title: "R",
        start: new Date("2026-11-01"),
        opponent: "St Peters",
        home: true,
        result: { us: 27, them: 7 },
      },
    ],
  );
  const out = unfolded(ics);
  assert.ok(out.includes("DESCRIPTION:Meet 10:30am."));
  assert.ok(out.includes("DESCRIPTION:Away match vs Whitchurch"));
  assert.ok(
    out.includes(
      "DESCRIPTION:Home match vs St Peters\\nResult: Rhiwbina Squirrels 27 – 7 St Peters",
    ),
  );
});

test("recurring events carry their RRULE", () => {
  const rrule = "FREQ=WEEKLY;BYDAY=TU;UNTIL=20270427T190000Z";
  const ics = calendar([
    "train",
    {
      title: "Training",
      type: "training",
      start: new Date("2026-10-27T20:00:00Z"),
      rrule,
    },
  ]);
  assert.ok(lines(ics).includes(`RRULE:${rrule}`));
});

test("Markdown notes become plain text in the description", () => {
  const ics = calendar([
    "md",
    { title: "M", start: new Date("2026-11-29") },
    "Meet **10:30am** at the [pitch](https://maps.app.goo.gl/abc).\n\n- Bring boots",
  ]);
  assert.ok(
    unfolded(ics).includes(
      "DESCRIPTION:Meet 10:30am at the pitch (https://maps.app.goo.gl/abc).\\n\\n• Bring boots",
    ),
  );
});

test("skipped sessions are written as an EXDATE in London time", () => {
  const ics = calendar([
    "train",
    {
      title: "Training",
      type: "training",
      start: new Date("2026-10-27T20:00:00Z"),
      rrule: "FREQ=WEEKLY;BYDAY=TU;UNTIL=20270427T190000Z",
      exdates: [
        new Date("2026-12-22T20:00:00Z"),
        new Date("2026-12-29T20:00:00Z"),
      ],
    },
  ]);
  assert.ok(
    unfolded(ics).includes(
      "EXDATE;TZID=Europe/London:20261222T200000,20261229T200000",
    ),
  );
});

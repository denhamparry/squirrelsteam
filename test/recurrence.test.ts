import assert from "node:assert/strict";
import { test } from "node:test";
import { isOccurrence, nextOccurrence, parseUntil } from "../src/lib/recurrence";

// The in-season series: Tuesdays 8-9pm London, 27 Oct 2026 to 27 Apr 2027.
const start = new Date("2026-10-27T20:00:00+00:00");
const end = new Date("2026-10-27T21:00:00+00:00");
const rule = "FREQ=WEEKLY;BYDAY=TU;UNTIL=20270427T190000Z";
const next = (now: string) =>
  nextOccurrence(start, end, rule, new Date(now))?.start.toISOString();

test("finds the next Tuesday from a Thursday", () => {
  assert.equal(next("2026-11-12T09:00:00Z"), "2026-11-17T20:00:00.000Z");
});

test("returns the first session before the series starts", () => {
  assert.equal(next("2026-09-01T00:00:00Z"), "2026-10-27T20:00:00.000Z");
});

test("counts a session that is still running", () => {
  assert.equal(next("2026-11-17T20:30:00Z"), "2026-11-17T20:00:00.000Z");
});

test("moves to next week once a session ends", () => {
  assert.equal(next("2026-11-17T21:00:01Z"), "2026-11-24T20:00:00.000Z");
});

test("keeps 8pm London time across the March clock change", () => {
  const o = nextOccurrence(start, end, rule, new Date("2027-03-29T12:00:00Z"));
  assert.equal(o?.start.toISOString(), "2027-03-30T19:00:00.000Z");
  assert.equal(o?.end?.toISOString(), "2027-03-30T20:00:00.000Z");
});

test("includes the UNTIL session and ends after it", () => {
  assert.equal(next("2027-04-21T12:00:00Z"), "2027-04-27T19:00:00.000Z");
  assert.equal(next("2027-04-27T20:00:01Z"), undefined);
});

test("keeps 10:30 London time across the October clock change", () => {
  const sunday = new Date("2026-08-09T10:30:00+01:00");
  const o = nextOccurrence(
    sunday,
    undefined,
    "FREQ=WEEKLY;BYDAY=SU",
    new Date("2026-11-02T00:00:00Z"),
  );
  assert.equal(o?.start.toISOString(), "2026-11-08T10:30:00.000Z");
});

test("returns null for rules it doesn't model", () => {
  const now = new Date("2026-11-12T00:00:00Z");
  assert.equal(nextOccurrence(start, end, "FREQ=WEEKLY;INTERVAL=2", now), null);
  assert.equal(nextOccurrence(start, end, "FREQ=WEEKLY;COUNT=5", now), null);
  assert.equal(nextOccurrence(start, end, "FREQ=MONTHLY", now), null);
});

test("parseUntil reads date-time and date-only UNTIL values", () => {
  assert.equal(parseUntil(rule)?.toISOString(), "2027-04-27T19:00:00.000Z");
  assert.equal(
    parseUntil("FREQ=WEEKLY;UNTIL=20270101")?.toISOString(),
    "2027-01-01T00:00:00.000Z",
  );
  assert.equal(parseUntil("FREQ=WEEKLY"), null);
});

test("skips exdates when finding the next session", () => {
  const christmas = [new Date("2026-12-22T20:00:00Z"), new Date("2026-12-29T20:00:00Z")];
  const o = nextOccurrence(start, end, rule, new Date("2026-12-16T12:00:00Z"), christmas);
  assert.equal(o?.start.toISOString(), "2027-01-05T20:00:00.000Z");
});

test("isOccurrence accepts only exact session starts", () => {
  assert.equal(isOccurrence(start, rule, new Date("2026-12-22T20:00:00Z")), true);
  // BST session keeps the 8pm London wall-clock time.
  assert.equal(isOccurrence(start, rule, new Date("2027-04-06T19:00:00Z")), true);
  assert.equal(isOccurrence(start, rule, new Date("2027-04-06T20:00:00Z")), false);
  assert.equal(isOccurrence(start, rule, new Date("2026-12-23T20:00:00Z")), false, "Wednesday");
  assert.equal(isOccurrence(start, rule, new Date("2026-12-22T19:00:00Z")), false, "wrong time");
  assert.equal(isOccurrence(start, rule, new Date("2026-10-20T20:00:00Z")), false, "before start");
  assert.equal(isOccurrence(start, rule, new Date("2027-05-04T19:00:00Z")), false, "after UNTIL");
});

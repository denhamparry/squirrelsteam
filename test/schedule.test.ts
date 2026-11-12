import assert from "node:assert/strict";
import { test } from "node:test";
import {
  formatWhen,
  isUpcoming,
  recurrenceText,
  upcomingSortKey,
} from "../src/lib/schedule";

const at = (iso: string) => new Date(iso);

test("an all-day fixture stays upcoming for the whole of its day", () => {
  const game = { data: { start: at("2026-11-22"), allDay: true } };
  assert.equal(isUpcoming(game, at("2026-11-22T04:17:00Z")), true);
  assert.equal(isUpcoming(game, at("2026-11-22T23:59:00Z")), true);
  assert.equal(isUpcoming(game, at("2026-11-23T04:17:00Z")), false);
});

test("a fixture with a result is finished straight away", () => {
  const game = { data: { start: at("2026-11-22"), allDay: true, result: { us: 1, them: 0 } } };
  assert.equal(isUpcoming(game, at("2026-11-22T13:17:00Z")), false);
});

test("a timed fixture is finished once it ends", () => {
  const game = { data: { start: at("2026-11-29T10:00:00Z"), end: at("2026-11-29T12:00:00Z") } };
  assert.equal(isUpcoming(game, at("2026-11-29T11:00:00Z")), true);
  assert.equal(isUpcoming(game, at("2026-11-29T13:17:00Z")), false);
});

test("a weekly series is upcoming until UNTIL and sorts by its next session", () => {
  const training = {
    data: {
      start: at("2026-10-27T20:00:00Z"),
      end: at("2026-10-27T21:00:00Z"),
      rrule: "FREQ=WEEKLY;BYDAY=TU;UNTIL=20270427T190000Z",
    },
  };
  const now = at("2026-11-12T09:00:00Z");
  assert.equal(isUpcoming(training, now), true);
  assert.equal(upcomingSortKey(training, now), at("2026-11-17T20:00:00Z").getTime());
  assert.equal(isUpcoming(training, at("2027-04-28T00:00:00Z")), false);
});

test("formatWhen formats all-day, multi-day and timed fixtures", () => {
  assert.equal(formatWhen({ data: { start: at("2026-11-22"), allDay: true } }), "Sun, 22 Nov 2026");
  assert.equal(
    formatWhen({ data: { start: at("2027-05-01"), end: at("2027-05-04"), allDay: true } }),
    "Sat, 1 May 2027 – Tue, 4 May 2027",
  );
  assert.equal(
    formatWhen({ data: { start: at("2026-11-15T10:30:00Z"), end: at("2026-11-15T12:00:00Z") } }),
    "Sun, 15 Nov 2026, 10:30 am–12:00 pm",
  );
});

test("formatWhen can format one session of a series", () => {
  const training = { data: { start: at("2026-10-27T20:00:00Z"), end: at("2026-10-27T21:00:00Z") } };
  assert.equal(
    formatWhen(training, { start: at("2026-11-17T20:00:00Z"), end: at("2026-11-17T21:00:00Z") }),
    "Tue, 17 Nov 2026, 8:00 pm–9:00 pm",
  );
});

test("recurrenceText describes weekly rules", () => {
  assert.equal(
    recurrenceText("FREQ=WEEKLY;BYDAY=TU;UNTIL=20270427T190000Z"),
    "Weekly on Tuesdays, until 27 Apr 2027",
  );
  assert.equal(recurrenceText("FREQ=WEEKLY;BYDAY=TU,TH"), "Weekly on Tuesdays and Thursdays");
  assert.equal(recurrenceText("BYDAY=TU"), null);
});

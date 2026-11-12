import assert from "node:assert/strict";
import { test } from "node:test";
import { fixtureErrors, fixtureWarnings } from "../src/lib/fixture-checks";

const now = new Date("2026-11-12T09:00:00Z");
const base = { title: "#1415 Gameday: Rumney RFC (Home)", type: "match", start: new Date("2026-11-15"), location: "Caedelyn Park" };

test("valid fixtures have no errors or warnings", () => {
  assert.deepEqual(fixtureErrors({ ...base, opponent: "Rumney RFC" }, now), []);
  assert.deepEqual(fixtureWarnings({ ...base, opponent: "Rumney RFC" }), []);
});

test("a result on a future fixture is an error", () => {
  const errors = fixtureErrors({ ...base, result: { us: 10, them: 5 } }, now);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /starts in the future/);
});

test("a result entered on match day is allowed", () => {
  const today = { ...base, start: new Date("2026-11-12"), result: { us: 10, them: 5 } };
  assert.deepEqual(fixtureErrors(today, now), []);
});

test("the title must name the opponent", () => {
  const errors = fixtureErrors({ ...base, opponent: "Old Illtydians", title: "#1415 Gameday: Old Illts (Away)" }, now);
  assert.match(errors[0], /doesn't name the opponent/);
});

test("a TBC title with an opponent set is an error", () => {
  const errors = fixtureErrors({ ...base, title: "#1415 Gameday: TBC vs Pontypridd RFC", opponent: "Pontypridd RFC" }, now);
  assert.match(errors.join(), /still says TBC/);
});

test("a score that doesn't add up from tries and conversions is a warning", () => {
  const warnings = fixtureWarnings({
    ...base,
    result: { us: 34, them: 7, tries: { us: 5, them: 1 }, conversions: { us: 3, them: 1 } },
  });
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /us score 34/);
});

test("a match without a location is a warning", () => {
  assert.deepEqual(fixtureWarnings({ ...base, location: undefined }), ["match has no location yet"]);
});

test("exdates must be sessions of the series", () => {
  const training = {
    title: "Training",
    type: "training",
    location: "The Barn",
    start: new Date("2026-10-27T20:00:00Z"),
    rrule: "FREQ=WEEKLY;BYDAY=TU;UNTIL=20270427T190000Z",
  };
  assert.deepEqual(fixtureErrors({ ...training, exdates: [new Date("2026-12-22T20:00:00Z")] }, now), []);
  assert.match(
    fixtureErrors({ ...training, exdates: [new Date("2026-12-22")] }, now).join(),
    /isn't one of the series' sessions/,
  );
  assert.match(
    fixtureErrors({ ...training, rrule: undefined, exdates: [new Date("2026-12-22T20:00:00Z")] }, now).join(),
    /no rrule/,
  );
});

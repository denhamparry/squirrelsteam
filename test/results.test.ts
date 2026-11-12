import assert from "node:assert/strict";
import { test } from "node:test";
import {
  calculateSeasonRecord,
  formatResult,
  resultOutcome,
} from "../src/lib/results";

const score = (us: number, them: number) => ({ us, them });

test("home results list the Squirrels first", () => {
  assert.equal(
    formatResult({ type: "match", home: true, opponent: "St Peters", result: score(27, 7) }),
    "Rhiwbina Squirrels 27 – 7 St Peters",
  );
});

test("away results list the opponent first", () => {
  assert.equal(
    formatResult({ type: "match", home: false, opponent: "Llandaff", result: score(47, 26) }),
    "Llandaff 26 – 47 Rhiwbina Squirrels",
  );
});

test("breakdowns use singular and plural correctly", () => {
  assert.equal(
    formatResult({
      type: "match",
      home: false,
      opponent: "Llandaff North",
      result: {
        ...score(28, 7),
        tries: score(4, 1),
        conversions: score(4, 1),
      },
    }),
    "Llandaff North 7 (1 try, 1 conversion) – 28 Rhiwbina Squirrels (4 tries, 4 conversions)",
  );
});

test("results without an opponent lead with the outcome code", () => {
  assert.equal(formatResult({ type: "match", result: score(10, 12) }), "L 10–12");
});

test("non-matches and unscored matches have no result", () => {
  assert.equal(formatResult({ type: "training", result: score(1, 0) }), null);
  assert.equal(formatResult({ type: "match" }), null);
});

test("resultOutcome reads win, draw and loss", () => {
  assert.equal(resultOutcome({ type: "match", result: score(5, 0) })?.code, "W");
  assert.equal(resultOutcome({ type: "match", result: score(5, 5) })?.code, "D");
  assert.equal(resultOutcome({ type: "match", result: score(0, 5) })?.code, "L");
});

test("the season record excludes pre-season friendlies", () => {
  const record = calculateSeasonRecord([
    { data: { type: "match", result: score(27, 15), preSeason: true } },
    { data: { type: "match", result: score(28, 7) } },
    { data: { type: "match", result: score(14, 54) } },
    { data: { type: "match", result: score(10, 10) } },
    { data: { type: "match" } },
  ]);
  assert.deepEqual(record, {
    played: 3,
    won: 1,
    drawn: 1,
    lost: 1,
    pointsFor: 52,
    pointsAgainst: 71,
  });
});

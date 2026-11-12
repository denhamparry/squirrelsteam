import assert from "node:assert/strict";
import { test } from "node:test";
import { cardTitle } from "../src/lib/titles";

test("cards drop the Gameday and Cup prefixes", () => {
  assert.equal(
    cardTitle("#1415 Gameday: Pontypridd RFC (Home, CISC)"),
    "Pontypridd RFC (Home, CISC)",
  );
  assert.equal(cardTitle("#1415 Cup: Ynysowen (Home)"), "Ynysowen (Home)");
});

test("other titles are unchanged", () => {
  assert.equal(cardTitle("Tour — Nice, France"), "Tour — Nice, France");
  assert.equal(cardTitle("Training"), "Training");
  assert.equal(cardTitle("#1415 Gameday:"), "#1415 Gameday:");
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { markdownToPlainText as plain } from "../src/lib/plain-text";

test("plain sentences and bare URLs are unchanged", () => {
  assert.equal(plain("Meet 10:30am, kick-off 11:00am."), "Meet 10:30am, kick-off 11:00am.");
  assert.equal(
    plain("Pin to pitch: https://maps.app.goo.gl/skq5saB4Xg2VUE6G6"),
    "Pin to pitch: https://maps.app.goo.gl/skq5saB4Xg2VUE6G6",
  );
});

test("links keep their URL", () => {
  assert.equal(
    plain("Meet at the [clubhouse](https://maps.app.goo.gl/abc)."),
    "Meet at the clubhouse (https://maps.app.goo.gl/abc).",
  );
  assert.equal(plain("[https://squirrels.team](https://squirrels.team)"), "https://squirrels.team");
  assert.equal(plain("<https://squirrels.team/tour/>"), "https://squirrels.team/tour/");
  assert.equal(plain("Email [us](mailto:contact@squirrels.team)"), "Email us (contact@squirrels.team)");
});

test("emphasis and code markers are removed", () => {
  assert.equal(plain("Meet **10:30am** at _the Barn_, bring `boots`."), "Meet 10:30am at the Barn, bring boots.");
  assert.equal(plain("*Kick-off* at __11__"), "Kick-off at 11");
});

test("underscores and asterisks inside words and URLs are kept", () => {
  assert.equal(plain("See https://example.com/a_b_c and snake_case_name"), "See https://example.com/a_b_c and snake_case_name");
  assert.equal(plain("2*3*4"), "2*3*4");
});

test("lists, headings, quotes and rules become plain lines", () => {
  const md = "## Kit\n\n- Boots\n* Gum shield\n1. Water\n\n> Arrive early\n\n---\n\n\n\nThanks";
  assert.equal(plain(md), "Kit\n\n• Boots\n• Gum shield\n1. Water\n\nArrive early\n\nThanks");
});

test("escaped characters are unescaped", () => {
  assert.equal(plain("U12s \\*only\\*"), "U12s *only*");
});

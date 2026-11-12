import { getCollection, type CollectionEntry } from "astro:content";
import { isUpcoming, upcomingSortKey } from "./schedule";

export {
  calculateSeasonRecord,
  formatResult,
  resultOutcome,
} from "./results";
export {
  formatLongDate,
  formatWhen,
  isPastDay,
  recurrenceText,
  upcomingOccurrence,
} from "./schedule";
export type { Occurrence } from "./schedule";
export type {
  ResultOutcome,
  ResultOutcomeCode,
  SeasonRecord,
} from "./results";

export type Fixture = CollectionEntry<"fixtures">;
export type FixtureType = Fixture["data"]["type"];

const TYPE_LABELS: Record<FixtureType, string> = {
  match: "Match",
  training: "Training",
  tour: "Tour",
  social: "Social",
  fundraiser: "Fundraiser",
};

export function typeLabel(type: FixtureType): string {
  return TYPE_LABELS[type];
}

/** All published fixtures (drafts excluded), sorted by start ascending. */
export async function getFixtures(): Promise<Fixture[]> {
  const entries = await getCollection("fixtures", ({ data }) => !data.draft);
  return entries.sort(
    (a, b) => a.data.start.getTime() - b.data.start.getTime(),
  );
}

/** Published tour fixtures, sorted by start ascending. */
export async function getTourFixtures(): Promise<Fixture[]> {
  const fixtures = await getFixtures();
  return fixtures.filter((fixture) => fixture.data.type === "tour");
}

/**
 * Fixtures that have not yet finished, soonest first. Recurring fixtures sort
 * by their next session, so a weekly series doesn't stay first all season.
 */
export async function getUpcomingFixtures(
  now: Date = new Date(),
): Promise<Fixture[]> {
  const fixtures = await getFixtures();
  return fixtures
    .filter((f) => isUpcoming(f, now))
    .sort((a, b) => upcomingSortKey(a, now) - upcomingSortKey(b, now));
}

/** Fixtures that have finished, most recent first. */
export async function getPastFixtures(
  now: Date = new Date(),
): Promise<Fixture[]> {
  const fixtures = await getFixtures();
  return fixtures.filter((f) => !isUpcoming(f, now)).reverse();
}

/** Finished, scored matches sorted most recent first. */
export async function getResults(now: Date = new Date()): Promise<Fixture[]> {
  const past = await getPastFixtures(now);
  return past.filter(
    (fixture) => fixture.data.type === "match" && fixture.data.result,
  );
}

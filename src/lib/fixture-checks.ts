// Build-time sanity checks for fixture data (#300). Errors fail the build via
// the content schema in src/content.config.ts; warnings are printed while the
// calendar feed is built (src/pages/fixtures.ics.ts). Kept free of astro:content
// so the rules can be unit tested.

interface ScorePair {
  us: number;
  them: number;
}

export interface CheckedFixture {
  title: string;
  type: string;
  start: Date;
  opponent?: string;
  location?: string;
  result?: ScorePair & { tries?: ScorePair; conversions?: ScorePair };
}

const TRY_POINTS = 5;
const CONVERSION_POINTS = 2;

const contains = (haystack: string, needle: string) =>
  haystack.toLocaleLowerCase("en-GB").includes(needle.toLocaleLowerCase("en-GB"));

/** Problems that mean the fixture data is wrong; each fails the build. */
export function fixtureErrors(data: CheckedFixture, now: Date): string[] {
  const errors: string[] = [];

  if (data.result && data.start.getTime() > now.getTime()) {
    errors.push(
      `has a result but starts in the future (${data.start.toISOString()}); check the date or remove the result`,
    );
  }

  if (data.opponent && !contains(data.title, data.opponent)) {
    errors.push(
      `title "${data.title}" doesn't name the opponent "${data.opponent}"; use the same spelling in both`,
    );
  }

  if (data.opponent && /\bTBC\b/.test(data.title)) {
    errors.push(
      `title still says TBC but opponent is "${data.opponent}"; replace TBC with the team name`,
    );
  }

  return errors;
}

/** Things worth a second look that can be legitimate; printed, never fatal. */
export function fixtureWarnings(data: CheckedFixture): string[] {
  const warnings: string[] = [];
  const { result } = data;

  // Penalty kicks at goal are allowed at U12, so a mismatch can be genuine.
  if (result?.tries && result.conversions) {
    for (const side of ["us", "them"] as const) {
      const fromBreakdown =
        result.tries[side] * TRY_POINTS +
        result.conversions[side] * CONVERSION_POINTS;
      if (fromBreakdown !== result[side]) {
        warnings.push(
          `${side} score ${result[side]} doesn't match ${result.tries[side]} tries and ${result.conversions[side]} conversions (${fromBreakdown}); fine if penalties were scored`,
        );
      }
    }
  }

  if (data.type === "match" && !data.location) {
    warnings.push("match has no location yet");
  }

  return warnings;
}

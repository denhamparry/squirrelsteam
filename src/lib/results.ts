const TEAM_NAME = "Rhiwbina Squirrels";

export interface ScorePair {
  us: number;
  them: number;
}

export interface ResultData {
  type: string;
  home?: boolean;
  opponent?: string;
  preSeason?: boolean;
  result?: ScorePair & {
    tries?: ScorePair;
    conversions?: ScorePair;
  };
}

export type ResultOutcomeCode = "W" | "D" | "L";

export interface ResultOutcome {
  code: ResultOutcomeCode;
  label: "Win" | "Draw" | "Loss";
}

export interface SeasonRecord {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  pointsFor: number;
  pointsAgainst: number;
}

type ScoreSide = keyof ScorePair;

function countLabel(value: number, singular: string, plural: string): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

function scoreBreakdown(
  result: NonNullable<ResultData["result"]>,
  side: ScoreSide,
): string {
  const details: string[] = [];
  if (result.tries) {
    details.push(countLabel(result.tries[side], "try", "tries"));
  }
  if (result.conversions) {
    details.push(
      countLabel(result.conversions[side], "conversion", "conversions"),
    );
  }
  return details.length > 0 ? ` (${details.join(", ")})` : "";
}

function orderedScore(
  data: ResultData,
  result: NonNullable<ResultData["result"]>,
): string {
  const usBreakdown = scoreBreakdown(result, "us");
  const themBreakdown = scoreBreakdown(result, "them");

  if (!data.opponent) {
    return usBreakdown || themBreakdown
      ? `${result.us}${usBreakdown} – ${result.them}${themBreakdown}`
      : `${result.us}–${result.them}`;
  }

  return data.home === false
    ? `${data.opponent} ${result.them}${themBreakdown} – ${result.us} ${TEAM_NAME}${usBreakdown}`
    : `${TEAM_NAME} ${result.us}${usBreakdown} – ${result.them} ${data.opponent}${themBreakdown}`;
}

/** Match result with team order matching the fixture's home/away perspective. */
export function formatResult(data: ResultData): string | null {
  if (data.type !== "match" || !data.result) return null;

  if (data.opponent) return orderedScore(data, data.result);

  const outcome = resultOutcome(data);
  return outcome ? `${outcome.code} ${orderedScore(data, data.result)}` : null;
}

/** Win/draw/loss outcome from the Squirrels' perspective. */
export function resultOutcome(data: ResultData): ResultOutcome | null {
  if (data.type !== "match" || !data.result) return null;

  const { us, them } = data.result;
  if (us === them) return { code: "D", label: "Draw" };
  return us > them
    ? { code: "W", label: "Win" }
    : { code: "L", label: "Loss" };
}

/** Competitive record for scored matches; pre-season fixtures are excluded. */
export function calculateSeasonRecord(
  fixtures: ReadonlyArray<{ data: ResultData }>,
): SeasonRecord {
  const record: SeasonRecord = {
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    pointsFor: 0,
    pointsAgainst: 0,
  };

  for (const fixture of fixtures) {
    const { data } = fixture;
    if (data.type !== "match" || !data.result || data.preSeason) continue;

    record.played += 1;
    record.pointsFor += data.result.us;
    record.pointsAgainst += data.result.them;

    const outcome = resultOutcome(data);
    if (outcome?.code === "W") record.won += 1;
    if (outcome?.code === "D") record.drawn += 1;
    if (outcome?.code === "L") record.lost += 1;
  }

  return record;
}

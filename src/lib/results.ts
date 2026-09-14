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

export interface ResultBreakdownLine {
  label: "Tries" | "Conversions";
  value: string;
}

export interface SeasonRecord {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  pointsFor: number;
  pointsAgainst: number;
}

function orderedScore(data: ResultData, score: ScorePair): string {
  if (!data.opponent) return `${score.us}–${score.them}`;

  return data.home === false
    ? `${data.opponent} ${score.them} – ${score.us} ${TEAM_NAME}`
    : `${TEAM_NAME} ${score.us} – ${score.them} ${data.opponent}`;
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

/** Optional scoring breakdowns in the same team order as the score line. */
export function formatResultBreakdown(
  data: ResultData,
): ResultBreakdownLine[] {
  if (data.type !== "match" || !data.result) return [];

  const lines: ResultBreakdownLine[] = [];
  if (data.result.tries) {
    lines.push({
      label: "Tries",
      value: orderedScore(data, data.result.tries),
    });
  }
  if (data.result.conversions) {
    lines.push({
      label: "Conversions",
      value: orderedScore(data, data.result.conversions),
    });
  }
  return lines;
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

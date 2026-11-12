// Match titles start with "#1415 Gameday:" so they stand out among a parent's
// other calendar entries. On the website, every card is already #1415's and
// carries a "Match" chip, so cards drop the prefix (#303).

export const GAMEDAY_PREFIX = "#1415 Gameday:";
const CUP_PREFIX = "#1415 Cup:";

/** A fixture title for website cards, without the calendar prefix. */
export function cardTitle(title: string): string {
  for (const prefix of [GAMEDAY_PREFIX, CUP_PREFIX]) {
    if (title.startsWith(prefix)) {
      const rest = title.slice(prefix.length).trim();
      return rest || title;
    }
  }
  return title;
}

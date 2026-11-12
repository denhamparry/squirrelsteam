// Fixture notes are written in Markdown (the Fixtures page renders them as
// HTML), but calendar clients show an event DESCRIPTION as plain text (#298).
// This converts the small Markdown subset notes use into readable text,
// keeping link URLs so they stay tappable in calendar apps.
//
// Supported: links and images, autolinks, bold/italic/code, headings,
// bullet and numbered lists, block quotes and horizontal rules.

const LINK = /!?\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;
const AUTOLINK = /<((?:https?:\/\/|mailto:)[^>\s]+)>/g;

// Escaped characters (\* \_ \#) are swapped for private-use placeholders so
// the emphasis rules can't consume them, then restored as literals.
const ESCAPABLE = "\\`*_{}[]()#+-.!>";
const PLACEHOLDER_BASE = 0xe000;

function protectEscapes(text: string): string {
  return text.replace(/\\([\\`*_{}[\]()#+\-.!>])/g, (_, ch: string) =>
    String.fromCharCode(PLACEHOLDER_BASE + ESCAPABLE.indexOf(ch)),
  );
}

function restoreEscapes(text: string): string {
  return text.replace(/[\ue000-\ue0ff]/g, (ch) =>
    ESCAPABLE.charAt(ch.charCodeAt(0) - PLACEHOLDER_BASE),
  );
}

function inline(text: string): string {
  return (
    text
      // [text](url) → "text (url)"; a link whose text is its URL stays bare.
      .replace(LINK, (_, label: string, url: string) => {
        const bare = url.replace(/^mailto:/, "");
        return !label || label === url || label === bare
          ? bare
          : `${label} (${bare})`;
      })
      .replace(AUTOLINK, (_, url: string) => url.replace(/^mailto:/, ""))
      .replace(/`([^`]+)`/g, "$1")
      .replace(/(\*\*|__)(?=\S)(.+?)(?<=\S)\1/g, "$2")
      .replace(/(?<![\w*])\*(?=\S)(.+?)(?<=\S)\*(?![\w*])/g, "$1")
      .replace(/(?<![\w_])_(?=\S)(.+?)(?<=\S)_(?![\w_])/g, "$1")
  );
}

function line(text: string): string {
  if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(text)) return "";
  return inline(
    protectEscapes(text)
      .replace(/^\s{0,3}>\s?/, "")
      .replace(/^\s{0,3}#{1,6}\s+(.*?)\s*#*\s*$/, "$1")
      .replace(/^(\s*)[-*+]\s+/, "$1• "),
  ).trimEnd();
}

/** Convert a fixture note's Markdown into plain text for an ICS DESCRIPTION. */
export function markdownToPlainText(markdown: string): string {
  const text = markdown
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map(line)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return restoreEscapes(text);
}

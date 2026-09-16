/**
 * Page routes that should remain reachable but must not be indexed.
 *
 * Keeping this list shared by the layout and sitemap filter prevents a page
 * from emitting `noindex` while still being advertised in the sitemap.
 */
export const NOINDEX_PATHS: readonly string[] = [];

function assertValidNoindexPath(pathname: string): void {
  if (
    pathname.trim() !== pathname ||
    !pathname.startsWith("/") ||
    pathname.startsWith("//")
  ) {
    throw new Error(
      `Invalid NOINDEX_PATHS entry ${JSON.stringify(pathname)}: expected a route with no surrounding whitespace starting with exactly one "/".`,
    );
  }
}

NOINDEX_PATHS.forEach(assertValidNoindexPath);

const NON_PAGE_PATHS = ["/fixtures.ics"];

export function normalizePagePath(pathname: string): string {
  const absolutePathname = pathname.startsWith("/") ? pathname : `/${pathname}`;

  return absolutePathname === "/"
    ? absolutePathname
    : `${absolutePathname.replace(/\/+$/, "")}/`;
}

export function findUnmatchedNoindexPaths(
  pagePathnames: Iterable<string>,
): readonly string[] {
  const normalizedPagePaths = new Set(
    Array.from(pagePathnames, normalizePagePath),
  );

  return NOINDEX_PATHS.filter(
    (noindexPath) => !normalizedPagePaths.has(normalizePagePath(noindexPath)),
  );
}

export function isNoindexPath(pathname: string): boolean {
  const normalizedPathname = normalizePagePath(pathname);

  return NOINDEX_PATHS.some(
    (noindexPath) => normalizePagePath(noindexPath) === normalizedPathname,
  );
}

export function shouldIncludeInSitemap(page: string): boolean {
  const { pathname } = new URL(page);

  return !NON_PAGE_PATHS.includes(pathname) && !isNoindexPath(pathname);
}

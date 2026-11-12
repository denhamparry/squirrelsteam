// Minimal stand-ins for astro:content fixture entries, for unit tests.
import type { CollectionEntry } from "astro:content";

type Fixture = CollectionEntry<"fixtures">;
type Data = Fixture["data"];

export function fixture(
  id: string,
  data: Partial<Data> & Pick<Data, "title" | "start">,
  body?: string,
): Fixture {
  return {
    id,
    collection: "fixtures",
    body,
    data: {
      type: "match",
      allDay: false,
      cup: false,
      preSeason: false,
      draft: false,
      ...data,
    },
  } as Fixture;
}

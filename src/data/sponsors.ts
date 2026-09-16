import type { ImageMetadata } from "astro";
import cornerstoneDark from "../assets/sponsors/cornerstone-finance-group-dark.svg";
import cornerstoneLight from "../assets/sponsors/cornerstone-finance-group-light.svg";
import dcPlasteringDark from "../assets/sponsors/dc-plastering-dark.png";
import dcPlasteringLight from "../assets/sponsors/dc-plastering-light.png";
import estGroupDark from "../assets/sponsors/est-group-dark.png";
import estGroupLight from "../assets/sponsors/est-group-light.png";
import hollybushDark from "../assets/sponsors/hollybush-properties-dark.png";
import hollybushLight from "../assets/sponsors/hollybush-properties-light.png";
import imperialDark from "../assets/sponsors/imperial-dark.png";
import imperialLight from "../assets/sponsors/imperial-light.png";
import onTheRiverDark from "../assets/sponsors/on-the-river-dark.png";
import onTheRiverLight from "../assets/sponsors/on-the-river-light.png";

export type SponsorTier = "primary" | "secondary";

export interface Sponsor {
  name: string;
  logoLight: ImageMetadata;
  logoDark: ImageMetadata;
  description: string | null;
  url: string | null;
  tier: SponsorTier;
}

const sponsorTierDefinitions = [
  { tier: "primary", label: "Primary sponsors" },
  { tier: "secondary", label: "Secondary sponsors" },
] as const;

const sponsorTierOrder: readonly SponsorTier[] = sponsorTierDefinitions.map(
  ({ tier }) => tier,
);

const unsortedSponsors: readonly Sponsor[] = [
  {
    name: "Cornerstone Finance Group",
    logoLight: cornerstoneLight,
    logoDark: cornerstoneDark,
    description: null,
    url: "https://cornerstonefinance.co.uk",
    tier: "primary",
  },
  {
    name: "D&C Plastering",
    logoLight: dcPlasteringLight,
    logoDark: dcPlasteringDark,
    description: null,
    url: null,
    tier: "secondary",
  },
  {
    name: "EST Group",
    logoLight: estGroupLight,
    logoDark: estGroupDark,
    description: null,
    url: "https://est-group.co.uk",
    tier: "secondary",
  },
  {
    name: "Hollybush Properties Ltd",
    logoLight: hollybushLight,
    logoDark: hollybushDark,
    description: null,
    url: null,
    tier: "primary",
  },
  {
    name: "Imperial",
    logoLight: imperialLight,
    logoDark: imperialDark,
    description: null,
    url: "https://imperialchartered.co.uk",
    tier: "primary",
  },
  {
    name: "On the River",
    logoLight: onTheRiverLight,
    logoDark: onTheRiverDark,
    description: null,
    url: "https://www.ontheriver.wales",
    tier: "primary",
  },
];

// Display primary sponsors first, then secondary, alphabetically within a tier.
export const sponsors: readonly Sponsor[] = [...unsortedSponsors].sort(
  (a, b) =>
    sponsorTierOrder.indexOf(a.tier) - sponsorTierOrder.indexOf(b.tier) ||
    a.name.localeCompare(b.name, "en-GB"),
);

export const sponsorTiers = sponsorTierDefinitions
  .map(({ tier, label }) => ({
    tier,
    label,
    sponsors: sponsors.filter((sponsor) => sponsor.tier === tier),
  }))
  .filter(({ sponsors }) => sponsors.length > 0);

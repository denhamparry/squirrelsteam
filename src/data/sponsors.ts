import type { ImageMetadata } from "astro";
import cornerstoneDark from "../assets/sponsors/cornerstone-finance-group-dark.svg";
import cornerstoneLight from "../assets/sponsors/cornerstone-finance-group-light.svg";
import dcPlasteringDark from "../assets/sponsors/dc-plastering-dark.png";
import dcPlasteringLight from "../assets/sponsors/dc-plastering-light.png";
import hollybushDark from "../assets/sponsors/hollybush-properties-dark.png";
import hollybushLight from "../assets/sponsors/hollybush-properties-light.png";
import imperialDark from "../assets/sponsors/imperial-dark.png";
import imperialLight from "../assets/sponsors/imperial-light.png";
import onTheRiverDark from "../assets/sponsors/on-the-river-dark.png";
import onTheRiverLight from "../assets/sponsors/on-the-river-light.png";

export interface Sponsor {
  name: string;
  logoLight: ImageMetadata;
  logoDark: ImageMetadata;
  description: string | null;
  url: string | null;
}

export const sponsors: readonly Sponsor[] = [
  {
    name: "Cornerstone Finance Group",
    logoLight: cornerstoneLight,
    logoDark: cornerstoneDark,
    description: null,
    url: "https://cornerstonefinance.co.uk",
  },
  {
    name: "D&C Plastering",
    logoLight: dcPlasteringLight,
    logoDark: dcPlasteringDark,
    description: null,
    url: null,
  },
  {
    name: "Hollybush Properties Ltd",
    logoLight: hollybushLight,
    logoDark: hollybushDark,
    description: null,
    url: null,
  },
  {
    name: "Imperial",
    logoLight: imperialLight,
    logoDark: imperialDark,
    description: null,
    url: "https://imperialchartered.co.uk",
  },
  {
    name: "On the River",
    logoLight: onTheRiverLight,
    logoDark: onTheRiverDark,
    description: null,
    url: "https://www.ontheriver.wales",
  },
];

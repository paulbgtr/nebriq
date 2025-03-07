import packageJson from "../../../package.json";

export const VERSION = {
  number: packageJson.version,
  releaseDate: "2025-03-07",
} as const;

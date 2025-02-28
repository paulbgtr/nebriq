import packageJson from "../../../package.json";

export const VERSION = {
  number: packageJson.version,
  releaseDate: "2024-02-28",
} as const;

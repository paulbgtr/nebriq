import packageJson from "../../../package.json";

export const VERSION = {
  number: packageJson.version,
  releaseDate: "2024-03-04",
} as const;

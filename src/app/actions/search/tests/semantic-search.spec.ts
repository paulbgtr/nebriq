import { expect, test, describe } from "bun:test";
import { semanticSearch } from "../semantic-search";
import { notes } from "./data/notes";

describe("semanticSearch", () => {
  test("returns the correct results", async () => {
    const results = await semanticSearch("coding-related stuff", notes);

    expect(results).toHaveLength(3);
    expect(results[0].id).toBe("1");
  });
});

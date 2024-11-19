import { expect, test, describe } from "bun:test";
import { searchUsingTFIDF } from "../tfidf";
import { notes } from "./data/notes";

describe("searchUsingTFIDF", () => {
  test("returns the correct results", () => {
    const results = searchUsingTFIDF("JavaScript", notes);
    expect(results).toHaveLength(3);
    expect(results[0].note.id).toBe("1");
  });

  test("returns an empty array if no results are found", () => {
    const results = searchUsingTFIDF("nonexistent query", notes);
    expect(results).toHaveLength(0);
  });

  test("returns the correct results for a query that matches the whole content", () => {
    const results = searchUsingTFIDF(
      "CSS allows you to style HTML elements, including layout, colors, and animations.",
      notes
    );
    expect(results).toHaveLength(2);
  });
});

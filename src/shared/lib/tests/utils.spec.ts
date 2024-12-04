import { expect, test, describe } from "bun:test";
import { extractNoteConnectionsFromContent } from "../utils";

describe("extractNoteConnectionsFromContent", () => {
  test("extracts note connections from content", () => {
    const content = "@note1 @note2 @note3";
    const noteConnections = extractNoteConnectionsFromContent(content);
    expect(noteConnections).toEqual(["note1", "note2", "note3"]);
  });
});

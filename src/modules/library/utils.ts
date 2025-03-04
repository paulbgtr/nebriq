import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { NotesByCategory } from "./types";

export const handleNotePlural = (count: number) => {
  return count === 1 ? "note" : "notes";
};

export const groupNotesByCategory = (notes: z.infer<typeof noteSchema>[]) => {
  const categorized: NotesByCategory = {};

  notes.forEach((note) => {
    if (!note.tags || note.tags.length === 0) {
      if (!categorized["Uncategorized"]) {
        categorized["Uncategorized"] = [];
      }
      categorized["Uncategorized"].push(note);
    } else {
      note.tags.forEach((tag) => {
        if (!categorized[tag]) {
          categorized[tag] = [];
        }
        categorized[tag].push(note);
      });
    }
  });

  return Object.entries(categorized).sort((a, b) => {
    if (a[0] === "Uncategorized") return 1;
    if (b[0] === "Uncategorized") return -1;
    return a[0].localeCompare(b[0]);
  });
};

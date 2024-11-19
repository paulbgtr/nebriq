import { TFIDFResult } from "@/modules/search/types";
import { Note } from "@/types/note";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertTFIDFToNotesWithDefaults(
  tfidfResults: TFIDFResult[]
): Note[] {
  return tfidfResults.map((result) => {
    const note = result.note;

    // Provide default values for empty or null fields
    return {
      id: note.id,
      user_id: note.user_id,
      title: note.title || "", // Default to "Untitled" if title is empty
      content: note.content || "", // Default if content is empty
      tags: note.tags || [], // Default to an empty array if tags are null
      linked_notes: note.linked_notes || [], // Default to an empty array if linked_notes are null
      created_at: note.created_at || new Date(), // Default to the current date if missing
    };
  });
}

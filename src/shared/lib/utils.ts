import { Note } from "@/types/note";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TFIDFResult } from "@/types/TFIDFResult";

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

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Extracts note connections from the given content string.
 */
export const extractNoteConnectionsFromContent = (
  content: string
): string[] => {
  const regex = /@(\w+)/g;
  const matches = content.matchAll(regex);
  const noteConnections: string[] = [];

  for (const match of matches) {
    noteConnections.push(match[1]);
  }

  return noteConnections;
};

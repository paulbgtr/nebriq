import { noteSchema } from "./schemas/note";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { tfidfResultSchema } from "./schemas/tfidf-result";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertTFIDFToNotesWithDefaults(
  tfidfResults: z.infer<typeof tfidfResultSchema>[]
): z.infer<typeof noteSchema>[] {
  return tfidfResults.map((result) => {
    const note = result.note;

    // Provide default values for empty or null fields
    return noteSchema.parse({
      id: note.id,
      user_id: note.user_id,
      title: note.title || "", // Default to "Untitled" if title is empty
      content: note.content || "", // Default if content is empty
      tags: note.tags || [], // Default to an empty array if tags are null
      linked_notes: note.linked_notes || [], // Default to an empty array if linked_notes are null
      created_at: note.created_at || new Date(), // Default to the current date if missing
    });
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

/**
 * Formats a note's content HTML by removing all HTML tags and trimming the result.
 */
export const formatHTMLNoteContent = (content: string): string => {
  return content ? content.replace(/<[^>]*>/g, "").trim() : "";
};

/**
 * Extracts the first name from the given email address.
 *
 * Example: `extractFirstName('john.doe@example.com')` returns `'john'`.
 *
 * @param email - The email address from which to extract the first name.
 * @returns The first name.
 */
export const extractFirstName = (email: string): string => {
  const [firstName] = email.split("@")[0].split(".");
  return firstName;
};

/**
 * Formats the given file size in bytes into a human-readable string.
 *
 * @param bytes - The file size in bytes.
 * @returns The formatted file size string.
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

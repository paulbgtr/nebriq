import { createAdminClient } from "@/shared/lib/supabase/admin";
import { noteSchema } from "../../../shared/lib/schemas/note";
import { z } from "zod";

type Note = z.infer<typeof noteSchema>;

/**
 * Fetches all notes from the database, bypassing Row Level Security (RLS).
 *
 * This function creates a Supabase client, fetches all notes from the "notes" table, and returns the data.
 * If any errors occur during the process, they are logged to the console.
 *
 * @returns {Promise<Note[] | undefined>} A promise that resolves to an array of notes, or undefined if an error occurred.
 */
export const getAllNotes = async (): Promise<Note[] | null> => {
  const supabase = createAdminClient();
  const { data: notes, error } = await supabase.from("notes").select("*");

  if (error) {
    throw new Error("Error fetching notes");
  }

  if (notes.length === 0) return null;

  return notes.map((note) =>
    noteSchema.parse({
      id: note.id,
      title: note.title,
      content: note.content,
      user_id: note.user_id,
      created_at: new Date(note.created_at),
    })
  );
};

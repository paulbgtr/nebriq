"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";

const getNote = async (id: string): Promise<z.infer<typeof noteSchema>> => {
  const supabase = await createClient();

  const { data: noteToDelete, error } = await supabase
    .from("notes")
    .select("id")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return noteSchema.parse(noteToDelete);
};

const handleNoteExists = async (
  id: string,
  errorMessage: string = "Note not found"
) => {
  try {
    const existingNote = await getNote(id);
    if (!existingNote) throw new Error(errorMessage);
    return existingNote;
  } catch (error) {
    console.error("Supabase error:", error);
    throw error;
  }
};

export const getNotes = async (
  userId: string
): Promise<z.infer<typeof noteSchema>[]> => {
  const supabase = await createClient();
  const { data: rawNotes } = await supabase
    .from("notes")
    .select(
      `
      *,
      note_tags (
        tags (
          id,
          name
        )
      )
    `
    )
    .eq("user_id", userId);

  if (!rawNotes) {
    throw new Error("No notes found");
  }

  return rawNotes?.map(({ note_tags, ...note }) => ({
    id: note.id,
    user_id: note.user_id,
    title: note.title ?? undefined,
    content: note.content ?? undefined,
    tags: note_tags
      ?.map((nt) => nt.tags?.name)
      .filter((tag): tag is string => tag !== undefined),
    created_at: new Date(note.created_at),
  }));
};

export const createNote = async (
  note: z.infer<typeof noteSchema>
): Promise<z.infer<typeof noteSchema>> => {
  const existingNote = await handleNoteExists(note.id);
  if (existingNote) throw new Error("Note already exists");

  const supabase = await createClient();
  const { data: newNote } = await supabase
    .from("notes")
    .insert({
      id: note.id,
      user_id: note.user_id,
      title: note.title ?? undefined,
      content: note.content ?? undefined,
    })
    .select();
  return noteSchema.parse(newNote);
};

export const updateNote = async (
  note: z.infer<typeof noteSchema>
): Promise<z.infer<typeof noteSchema>> => {
  await handleNoteExists(note.id);

  const supabase = await createClient();

  const { data: updatedNote } = await supabase
    .from("notes")
    .update({
      id: note.id,
      user_id: note.user_id,
      title: note.title ?? undefined,
      content: note.content ?? undefined,
    })
    .eq("id", note.id)
    .select();
  return noteSchema.parse(updatedNote);
};

export const deleteNote = async (
  id: string
): Promise<z.infer<typeof noteSchema>> => {
  await handleNoteExists(id);

  const supabase = await createClient();

  const { data: deletedNote } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (!deletedNote) {
    throw new Error("Note not found");
  }

  return noteSchema.parse(deletedNote);
};

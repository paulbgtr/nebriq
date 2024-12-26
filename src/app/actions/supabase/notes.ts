"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { z } from "zod";
import {
  noteSchema,
  createNoteSchema,
  updateNoteSchema,
} from "@/shared/lib/schemas/note";

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
  note: z.infer<typeof createNoteSchema>
): Promise<z.infer<typeof noteSchema>> => {
  const supabase = await createClient();

  const { data: newNote, error } = await supabase
    .from("notes")
    .insert({
      user_id: note.user_id,
      title: note.title ?? undefined,
      content: note.content ?? undefined,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return noteSchema.parse({
    ...newNote,
    created_at: new Date(newNote.created_at),
  });
};

export const updateNote = async (
  note: z.infer<typeof updateNoteSchema>
): Promise<z.infer<typeof noteSchema>> => {
  const supabase = await createClient();

  const { data: updatedNote, error } = await supabase
    .from("notes")
    .update({
      title: note.title ?? undefined,
      content: note.content ?? undefined,
    })
    .eq("id", note.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return noteSchema.parse({
    ...updatedNote,
    created_at: new Date(updatedNote.created_at),
  });
};

export const deleteNote = async (
  id: string
): Promise<z.infer<typeof noteSchema>> => {
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

  return noteSchema.parse({
    ...deletedNote,
    created_at: new Date(deletedNote.created_at),
  });
};

export const deleteNotes = async (ids: string[]): Promise<void> => {
  const supabase = await createClient();
  await supabase.from("notes").delete().in("id", ids);
};

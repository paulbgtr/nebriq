"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { type CreateNote, type UpdateNote } from "@/types/note";

export const getNotes = async (userId: string) => {
  const supabase = await createClient();
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId);
  return notes;
};

export const createNote = async (note: CreateNote) => {
  const supabase = await createClient();
  const { data: newNote } = await supabase.from("notes").insert(note).select();
  return newNote;
};

export const updateNote = async (note: UpdateNote) => {
  const supabase = await createClient();
  const { data: updatedNote } = await supabase
    .from("notes")
    .update(note)
    .eq("id", note.id)
    .select();
  return updatedNote;
};

export const deleteNote = async (id: string) => {
  const supabase = await createClient();
  const { data: deletedNote } = await supabase
    .from("notes")
    .delete()
    .eq("id", id);
  return deletedNote;
};

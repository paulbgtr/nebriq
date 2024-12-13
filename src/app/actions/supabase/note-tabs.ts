"use server";

import { createClient } from "@/shared/lib/supabase/server";

export const getNoteTabs = async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("note_tabs")
    .select(
      `
      id,
      note_id,
      created_at,
      notes!inner (
        id,
        title,
        content,
        user_id
      )
    `
    )
    .eq("notes.user_id", userId);

  return data;
};

export const createNoteTab = async (noteTab: { note_id: string }) => {
  const supabase = await createClient();
  const { data: newNoteTab } = await supabase
    .from("note_tabs")
    .insert(noteTab)
    .select()
    .single();
  return newNoteTab;
};

export const deleteNoteTab = async (id: number) => {
  const supabase = await createClient();
  const { data: deletedNoteTab } = await supabase
    .from("note_tabs")
    .delete()
    .eq("id", id);
  return deletedNoteTab;
};

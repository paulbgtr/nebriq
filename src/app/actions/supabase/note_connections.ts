"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { NoteConnection, CreateNoteConnection } from "@/types/note-connection";

export const createNoteConnection = async (
  noteConnection: CreateNoteConnection
): Promise<NoteConnection> => {
  const supabase = await createClient();
  const { data: newConnection, error } = await supabase
    .from("note_connections")
    .insert({
      note_id_from: noteConnection.note_id_from,
      note_id_to: noteConnection.note_id_to,
    })
    .select()
    .single();

  console.log(error);
  return newConnection;
};

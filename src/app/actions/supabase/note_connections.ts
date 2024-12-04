"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { NoteConnection, CreateNoteConnection } from "@/types/note-connection";

export const getNoteConnections = async (noteId: string) => {
  const supabase = await createClient();
  const { data: noteConnections } = await supabase
    .from("note_connections")
    .select("*")
    .eq("note_id_from", noteId);
  return noteConnections;
};

export const createNoteConnection = async (
  noteConnection: CreateNoteConnection
): Promise<NoteConnection> => {
  const supabase = await createClient();

  if (!noteConnection.user_id) {
    const { data: user } = await supabase.auth.getUser();
    noteConnection.user_id = user?.user?.id;
  }

  const { data: newConnection } = await supabase
    .from("note_connections")
    .insert({
      user_id: noteConnection.user_id,
      note_id_from: noteConnection.note_id_from,
      note_id_to: noteConnection.note_id_to,
    })
    .select()
    .single();

  return newConnection;
};

export const deleteNoteConnection = async (id: string) => {
  const supabase = await createClient();
  const { data: deletedConnection } = await supabase
    .from("note_connections")
    .delete()
    .eq("id", id)
    .select();

  return deletedConnection;
};

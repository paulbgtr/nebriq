"use server";

import { z } from "zod";
import { noteConnectionSchema } from "@/shared/lib/schemas/note-connection";
import { createClient } from "@/shared/lib/supabase/server";

export const getAllNoteConnections = async (): Promise<
  z.infer<typeof noteConnectionSchema>[]
> => {
  const supabase = await createClient();
  const { data: noteConnections } = await supabase
    .from("note_connections")
    .select("*");
  return noteConnectionSchema.array().parse(noteConnections);
};

export const getNoteConnections = async (
  noteId: string
): Promise<z.infer<typeof noteConnectionSchema>[]> => {
  const supabase = await createClient();
  const { data: noteConnections } = await supabase
    .from("note_connections")
    .select("*")
    .eq("note_id_from", noteId);
  return noteConnectionSchema.array().parse(noteConnections);
};

export const createNoteConnection = async (
  noteConnection: z.infer<typeof noteConnectionSchema>
): Promise<z.infer<typeof noteConnectionSchema>> => {
  const supabase = await createClient();

  if (!noteConnection.user_id) {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error.message);
    }

    noteConnection.user_id = data.user?.id;
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

  return noteConnectionSchema.parse(newConnection);
};

export const deleteNoteConnection = async (
  id: string
): Promise<z.infer<typeof noteConnectionSchema>> => {
  const supabase = await createClient();

  const { data: deletedConnection } = await supabase
    .from("note_connections")
    .delete()
    .eq("id", id)
    .select()
    .single();

  return noteConnectionSchema.parse(deletedConnection);
};

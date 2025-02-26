"use server";

import { z } from "zod";
import {
  noteConnectionSchema,
  createNoteConnectionSchema,
} from "@/shared/lib/schemas/note-connection";
import { createClient } from "@/shared/lib/supabase/server";

export const getAllNoteConnections = async (): Promise<
  z.infer<typeof noteConnectionSchema>[]
> => {
  const supabase = await createClient();
  const { data: noteConnections, error } = await supabase
    .from("note_connections")
    .select("*");

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  return noteConnectionSchema.array().parse(
    noteConnections?.map((noteConnection) => ({
      ...noteConnection,
      created_at: new Date(noteConnection.created_at),
    }))
  );
};

export const getNoteConnections = async (
  noteId: string
): Promise<z.infer<typeof noteConnectionSchema>[]> => {
  const supabase = await createClient();
  const { data: noteConnections, error } = await supabase
    .from("note_connections")
    .select("*")
    .eq("note_id_from", noteId);

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  return noteConnectionSchema.array().parse(
    noteConnections?.map((noteConnection) => ({
      ...noteConnection,
      created_at: new Date(noteConnection.created_at),
    }))
  );
};

export const createNoteConnection = async (
  noteConnection: z.infer<typeof createNoteConnectionSchema>
): Promise<z.infer<typeof noteConnectionSchema>> => {
  const supabase = await createClient();

  if (!noteConnection.user_id) {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error.message);
    }

    noteConnection.user_id = data.user?.id;
  }

  const { data: newConnection, error } = await supabase
    .from("note_connections")
    .insert({
      user_id: noteConnection.user_id,
      note_id_from: noteConnection.note_id_from,
      note_id_to: noteConnection.note_id_to,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  return noteConnectionSchema.parse({
    ...newConnection,
    created_at: new Date(newConnection.created_at),
  });
};

export const deleteNoteConnection = async (
  id: string
): Promise<z.infer<typeof noteConnectionSchema> | null> => {
  const supabase = await createClient();

  try {
    const { data: deletedConnection, error } = await supabase
      .from("note_connections")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error in deleteNoteConnection:", error);

      if (error.code === "PGRST116" || error.message.includes("not found")) {
        return null;
      }

      throw error;
    }

    return noteConnectionSchema.parse({
      ...deletedConnection,
      created_at: new Date(deletedConnection.created_at),
    });
  } catch (error) {
    console.error("Error in deleteNoteConnection:", error);
    return null;
  }
};

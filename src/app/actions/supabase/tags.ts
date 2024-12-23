"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { z } from "zod";
import { tagSchema, updateTagSchema } from "@/shared/lib/schemas/tag";

export const getTagLinks = async (): Promise<z.infer<typeof tagSchema>[]> => {
  const supabase = await createClient();
  const { data: tags } = await supabase.from("note_tags").select("*");
  return tagSchema.array().parse(tags);
};

export const getTagsByNoteId = async (
  noteId: string
): Promise<z.infer<typeof tagSchema>[]> => {
  const supabase = await createClient();
  const { data: tags } = await supabase
    .from("note_tags")
    .select(
      `
      tags (
      id, name
      ) 
      `
    )
    .eq("note_id", noteId);
  return tagSchema.array().parse(tags);
};

export const createTag = async (tag: { name: string; user_id: string }) => {
  try {
    const supabase = await createClient();
    const { data: newTag, error } = await supabase
      .from("tags")
      .insert(tag)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return newTag;
  } catch (error) {
    console.error("Server error:", error);
    throw error;
  }
};

export const linkTagToNote = async (tagId: number, noteId: string) => {
  const supabase = await createClient();
  const { data: linkedTag } = await supabase
    .from("note_tags")
    .insert({
      note_id: noteId,
      tag_id: tagId,
    })
    .select()
    .single();
  return linkedTag;
};

export const updateTag = async (
  tag: z.infer<typeof updateTagSchema>
): Promise<z.infer<typeof tagSchema>> => {
  const supabase = await createClient();
  const { data: updatedTag } = await supabase
    .from("tags")
    .update({
      name: tag.name,
      note_id: tag.note_id,
    })
    .eq("id", tag.id)
    .select();
  return tagSchema.parse(updatedTag);
};

export const deleteTag = async (
  name: string
): Promise<z.infer<typeof tagSchema>> => {
  const supabase = await createClient();

  // todo: ensure that getting tag by name is reliable
  const { data: noteToDelete } = await supabase
    .from("tags")
    .select("id")
    .eq("name", name)
    .single();

  if (!noteToDelete) {
    throw new Error("Tag not found");
  }

  await supabase.from("note_tags").delete().eq("tag_id", noteToDelete.id);

  const { data: deletedTag } = await supabase
    .from("tags")
    .delete()
    .eq("id", noteToDelete.id);
  return tagSchema.parse(deletedTag);
};

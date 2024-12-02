"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { UpdateTag } from "@/types/tag";

export const getTagLinks = async () => {
  const supabase = await createClient();
  const { data: tags } = await supabase.from("note_tags").select("*");
  return tags;
};

export const getTagsByNoteId = async (noteId: string) => {
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
  return tags;
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

export const linkTagToNote = async (tagId: string, noteId: string) => {
  console.log("tagId", tagId);
  console.log("noteId", noteId);

  const supabase = await createClient();
  const { data: linkedTag, error } = await supabase
    .from("note_tags")
    .insert({ note_id: noteId, tag_id: tagId })
    .select()
    .single();

  console.log(error);
  return linkedTag;
};

export const updateTag = async (tag: UpdateTag) => {
  const supabase = await createClient();
  const { data: updatedTag } = await supabase
    .from("tags")
    .update(tag)
    .eq("id", tag.id)
    .select();
  return updatedTag;
};

export const deleteTag = async (name: string) => {
  const supabase = await createClient();

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
  return deletedTag;
};

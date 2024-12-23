"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { z } from "zod";
import {
  tagSchema,
  createTagSchema,
  updateTagSchema,
} from "@/shared/lib/schemas/tag";

export const getTagsByNoteId = async (
  noteId: string
): Promise<z.infer<typeof tagSchema>[]> => {
  const supabase = await createClient();
  const { data: tags, error } = await supabase
    .from("note_tags")
    .select(
      `
      tags (
      *
      ) 
      `
    )
    .eq("note_id", noteId);

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  return tagSchema.array().parse(
    tags?.map(({ tags: tag }) => {
      if (!tag) {
        throw new Error("Tag not found");
      }

      return {
        id: tag.id,
        name: tag.name,
        user_id: tag.user_id,
        note_id: tag.note_id,
        created_at: new Date(tag.created_at),
      };
    })
  );
};

export const createTag = async (tag: z.infer<typeof createTagSchema>) => {
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
  id: number
): Promise<z.infer<typeof tagSchema>> => {
  const supabase = await createClient();

  const { data: tagToDelete } = await supabase
    .from("tags")
    .select("id")
    .eq("id", id)
    .single();

  if (!tagToDelete) {
    throw new Error("Tag not found");
  }

  await supabase.from("note_tags").delete().eq("tag_id", tagToDelete.id);

  const { data: deletedTag, error } = await supabase
    .from("tags")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  return tagSchema.parse({
    ...deletedTag,
    created_at: new Date(deletedTag.created_at),
  });
};

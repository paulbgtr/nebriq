import { z } from "zod";

export const tagSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  note_id: z.string(),
  name: z.string(),
  created_at: z.date().optional(),
});

export const createTagSchema = tagSchema.omit({
  id: true,
  created_at: true,
});

export const updateTagSchema = tagSchema.omit({
  user_id: true,
  created_at: true,
});

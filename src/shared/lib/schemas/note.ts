import { z } from "zod";

export const noteSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  linked_notes: z.array(z.string()).optional(),
  created_at: z.date(),
});

import { z } from "zod";

export const noteConnectionSchema = z.object({
  id: z.string(),
  user_id: z.string().optional(),
  note_id_from: z.string(),
  note_id_to: z.string(),
  created_at: z.date().optional(),
});

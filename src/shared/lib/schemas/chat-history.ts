import { z } from "zod";

export const chatSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  created_at: z.string(),
  metadata: z.any(),
});

export const chatHistoryElementSchema = z.object({
  ...chatSchema.shape,
  messages: z.array(
    z.object({
      id: z.string(),
      session_id: z.string(),
      message: z.string(),
    })
  ),
});

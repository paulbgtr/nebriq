import { z } from "zod";

export const chatSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string().nullable(),
  created_at: z.string(),
  metadata: z.any(),
});

export const chatHistoryElementSchema = z.object({
  ...chatSchema.shape,
  messages: z.array(
    z.object({
      id: z.number(),
      session_id: z.string(),
      created_at: z.string().optional(),
      message: z.object({
        type: z.string(),
        content: z.string(),
        additional_kwargs: z.any(),
        response_metadata: z.any(),
        created_at: z.string().optional(),
      }),
    })
  ),
});

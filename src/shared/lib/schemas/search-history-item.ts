import { z } from "zod";

export const searchHistoryItemSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  query: z.string(),
  summary: z.string().optional().nullable(),
  created_at: z.date(),
});

export const createSearhHistoryItemSchema = searchHistoryItemSchema.omit({
  id: true,
  created_at: true,
});

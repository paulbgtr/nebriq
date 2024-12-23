import { z } from "zod";

export const tokenLimitSchema = z.object({
  user_id: z.string(),
  token_limit: z.union([z.literal(5000), z.literal(30000)]).optional(),
  tokens_used: z.number().optional(),
  reset_date: z.date().optional(),
});

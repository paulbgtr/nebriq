import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";

export const tfidfResultSchema = z.object({
  score: z.number(),
  note: noteSchema,
});

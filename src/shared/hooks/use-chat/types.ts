import { noteSchema } from "@/shared/lib/schemas/note";
import { z } from "zod";

type BaseNote = z.infer<typeof noteSchema>;
export type NoteWithScore = BaseNote & {
  score?: number;
  matchType?: "semantic" | "tfidf" | "both";
};

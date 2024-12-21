import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";

export type TFIDFResult = {
  score: number;
  note: z.infer<typeof noteSchema>;
};

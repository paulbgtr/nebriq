import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";

export type ConversationTurn = {
  role: "user" | "assistant";
  content: string;
};

export type ChatContext = {
  conversationHistory: ConversationTurn[];
  relevantNotes: z.infer<typeof noteSchema>[];
};

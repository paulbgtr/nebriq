import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { ModelId } from "@/types/ai-model";

export type ConversationTurn = {
  role: "user" | "assistant";
  content: string;
  relevantNotes?: z.infer<typeof noteSchema>[];
  attachedNotes?: z.infer<typeof noteSchema>[];
  modelId?: ModelId;
};

export type ChatContext = {
  conversationHistory: ConversationTurn[];
  relevantNotes: z.infer<typeof noteSchema>[];
};

import { Note } from "./note";

export type ConversationTurn = {
  role: "user" | "assistant";
  content: string;
};

export type FollowUpContext = {
  conversationHistory: ConversationTurn[];
  relevantNotes: Note[];
};

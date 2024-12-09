import { Note } from "./note";

export type LLMAnswer = {
  answer: string;
  notes: Note[];
};

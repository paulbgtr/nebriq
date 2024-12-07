"use server";

import OpenAI from "openai";
import { TFIDFResult } from "@/types/TFIDFResult";
import { Note } from "@/types/note";
import { formatHTMLNoteContent } from "@/shared/lib/utils";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in environment");
}

/**
 * Selects relevant notes from the given results, prioritizing shorter notes first.
 */
const selectRelevantNotes = (
  results: TFIDFResult[],
  maxTokens = 1000
): TFIDFResult[] => {
  let totalTokens = 0;
  return results.filter((result) => {
    const resultWithoutHTML = formatHTMLNoteContent(result.note.content || "");

    const noteTokens = resultWithoutHTML?.split(/\s+/)?.length;
    if (totalTokens + (noteTokens || 0) <= maxTokens) {
      totalTokens += noteTokens || 0;
      return true;
    }
    return false;
  });
};

/**
 * Extracts the most relevant sentences from a note's content that match a search query.
 */
const extractKeyFragments = (
  note: Note,
  query: string,
  maxlength = 100
): string | undefined => {
  const sentences = note.content?.split(/[.!?]+/);
  return sentences
    ?.filter((sentence: string) =>
      sentence.toLowerCase().includes(query.toLowerCase())
    )
    .filter((sentence: string) => sentence.trim())
    .slice(0, 3)
    .join(" ")
    .substring(0, maxlength);
};

/**
 * Prepares the context for a prompt from the given relevant notes and query.
 */
const prepareContext = (
  relevantNotes: TFIDFResult[],
  query: string
): string => {
  return relevantNotes
    .map((result) => {
      const keyFragment = extractKeyFragments(result.note, query);
      return `Note "${result.note.title}": ${keyFragment}`;
    })
    .join("\n\n");
};

/**
 * Creates a prompt for the LLM using the given query and context.
 */
const createPrompt = (query: string, context: string): string => {
  return `Using the following fragments from the user's notes, answer the question. Base your answer only on the provided information:

  ${context}

  Question: ${query}

  Give a brief and accurate answer, using only the information from the notes. If there is not enough information, indicate that.`;
};

export const llmAnswer = async (query: string, data: TFIDFResult[]) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const relevantNotes = selectRelevantNotes(data);
    const context = prepareContext(relevantNotes, query);
    const prompt = createPrompt(query, context);

    console.log("relevantNotes", relevantNotes);
    console.log("prompt", prompt);
    console.log("context", context);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(`chatgpt error: ${error}`);
    throw error;
  }
};

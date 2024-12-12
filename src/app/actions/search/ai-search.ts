"use server";

import OpenAI from "openai";
import { TFIDFResult } from "@/types/TFIDFResult";
import { Note } from "@/types/note";
import { formatHTMLNoteContent } from "@/shared/lib/utils";
import { convertTFIDFToNotesWithDefaults } from "@/shared/lib/utils";
import { LLMAnswer } from "@/types/llm-answer";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in environment");
}

/**
 * Selects relevant notes from the given results, prioritizing shorter notes first.
 */
const selectRelevantNotes = (notes: Note[], maxTokens = 1000): Note[] => {
  let totalTokens = 0;
  return notes.filter((note) => {
    const resultWithoutHTML = formatHTMLNoteContent(note.content || "");

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
  maxlength = 500
): string | undefined => {
  const sentences = note.content?.split(/[.!?]+/);
  return sentences
    ?.filter((sentence: string) =>
      sentence.toLowerCase().includes(query.toLowerCase())
    )
    .filter((sentence: string) => sentence.trim())
    .slice(0, 5)
    .join(". ")
    .substring(0, maxlength);
};

/**
 * Prepares the context for a prompt from the given relevant notes and query.
 */
const prepareContext = (relevantNotes: Note[], query: string): string => {
  return relevantNotes
    .map((note) => {
      const keyFragment = extractKeyFragments(note, query);
      return `Note "${note.title}": ${keyFragment}`;
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

  Format your response using HTML tags for better presentation. Use <p> for paragraphs, <strong> for emphasis, <ul>/<li> for lists, and <em> for highlighting key terms. If there is relevant information in the notes, provide a brief and accurate answer based solely on that information. If there is no relevant information available, respond with: "<p>I don't have any specific information about this topic in your notes, but here's what I can tell you about <strong>[topic]</strong>: [general explanation of the topic/concept]</p>". Always maintain accuracy and clarity in your response.`;
};

export const llmAnswer = async (
  query: string,
  data: Note[]
): Promise<LLMAnswer> => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const relevantNotes = selectRelevantNotes(data);

    const context = prepareContext(relevantNotes, query);
    const prompt = createPrompt(query, context);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return {
      answer: completion.choices[0].message.content || "",
      notes: relevantNotes,
    };
  } catch (error) {
    console.error(`chatgpt error: ${error}`);
    throw error;
  }
};

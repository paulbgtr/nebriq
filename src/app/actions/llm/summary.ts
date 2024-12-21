"use server";

import OpenAI from "openai";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { handleTokenLimits } from "./utils";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in environment");
}

/**
 * Extracts the most relevant sentences from a note's content that match a search query.
 */
const extractKeyFragments = (
  note: z.infer<typeof noteSchema>,
  maxlength = 500
): string | undefined => {
  if (!note.content) return undefined;
  return note.content.substring(0, maxlength);
};

/**
 * Prepares the context for a prompt from the given relevant notes and query.
 */
const prepareContext = (
  relevantNotes: z.infer<typeof noteSchema>[]
): string => {
  return relevantNotes
    .map((note) => {
      const keyFragment = extractKeyFragments(note);
      return `Note "${note.title}"\n${keyFragment}`;
    })
    .join("\n\n");
};

/**
 * Creates a prompt for the LLM using the given context.
 */
const createPrompt = (context: string): string => {
  return `Summarize the information from the user's notes in a concise and organized manner, using the provided information:

  ${context}

  If the notes contain relevant information:
  - Synthesize the information from all relevant notes
  - Highlight relationships between different concepts
  - Present the information in a logical, hierarchical manner
  
  Always prioritize accuracy and clarity in your response.`;
};

export const summarize = async (
  data: z.infer<typeof noteSchema>[],
  userId: string
): Promise<string | null> => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const context = prepareContext(data);
    const prompt = createPrompt(context);

    await handleTokenLimits(userId, prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return completion.choices[0].message.content || null;
  } catch (error) {
    console.error(`chatgpt error: ${error}`);
    throw error;
  }
};

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
      return `Note "${note.title}":\n${keyFragment}`;
    })
    .join("\n\n");
};

/**
 * Creates a prompt for the LLM using the given context and search query.
 */
const createPrompt = (searchQuery: string, context: string): string => {
  return `Answer the user's question "${searchQuery}" based on their notes:

  Context from notes:
  ${context}

  Instructions:
  1. Provide a direct, practical answer in 2-3 sentences using ONLY information from the notes
  2. If the notes contain relevant information, start with "Based on your notes..."
  3. If the notes lack sufficient information, respond with "Your notes don't contain enough relevant information about this. Consider adding notes about..."
  4. Focus only on information that directly answers the question
  5. Don't explain or summarize unrelated information
  6. If the question is unclear, provide the most relevant information from the notes

  Keep your response BRIEF and ACTIONABLE.`;
};

export const summarize = async (
  data: z.infer<typeof noteSchema>[],
  userId: string,
  searchQuery: string
): Promise<string | null> => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const context = prepareContext(data);
    const prompt = createPrompt(searchQuery, context);

    await handleTokenLimits(userId, prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or your preferred model
      messages: [
        {
          role: "system",
          content:
            "You are a concise note assistant that provides brief, practical answers based on user notes.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more focused responses
      max_tokens: 150, // Limit response length
    });

    return completion.choices[0].message.content || null;
  } catch (error) {
    console.error(`OpenAI API error: ${error}`);
    throw error;
  }
};

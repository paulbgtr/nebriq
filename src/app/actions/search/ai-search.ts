"use server";

import OpenAI from "openai";
import { Note } from "@/types/note";
import { formatHTMLNoteContent } from "@/shared/lib/utils";
import { LLMAnswer } from "@/types/llm-answer";
import { getEncoding } from "js-tiktoken";
import { getUserTokenLimits, updateTokenLimit } from "../supabase/token_limits";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in environment");
}

/**
 * Extracts the most relevant sentences from a note's content that match a search query.
 */
const extractKeyFragments = (
  note: Note,
  maxlength = 500
): string | undefined => {
  if (!note.content) return undefined;
  return note.content.substring(0, maxlength);
};

/**
 * Prepares the context for a prompt from the given relevant notes and query.
 */
const prepareContext = (relevantNotes: Note[]): string => {
  return relevantNotes
    .map((note) => {
      const keyFragment = extractKeyFragments(note);
      return `Note "${note.title}"\n${keyFragment}`;
    })
    .join("\n\n");
};

/**
 * Creates a prompt for the LLM using the given query and context.
 */
const createPrompt = (query: string, context: string): string => {
  return `Using the following fragments from the user's notes, provide a comprehensive answer to the question. Base your answer only on the provided information:

  ${context}

  Question: ${query}

  Format your response using HTML tags for better presentation, following these guidelines:
  1. Start with a brief overview using <p> tags
  2. Use <strong> for key concepts and terms
  3. Use <em> for definitions and important explanations
  4. If there are multiple points or concepts, use <ul>/<li> to list them
  5. Include relevance scores to show how closely each note matches the query
  
  If the notes contain relevant information:
  - Synthesize the information from all relevant notes
  - Highlight relationships between different concepts
  - Present the information in a logical, hierarchical manner
  
  If there is no relevant information available:
  Respond with: "<p>I don't have any specific information about <strong>[topic]</strong> in your notes, but here's a general overview: [brief explanation]</p>"
  
  Always prioritize accuracy and clarity in your response.`;
};

export const llmAnswer = async (
  query: string,
  data: Note[],
  userId: string
): Promise<LLMAnswer> => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const context = prepareContext(data);
    const prompt = createPrompt(query, context);

    const tokenLimit = await getUserTokenLimits(userId);

    if (!tokenLimit) {
      throw new Error("Token limit not found");
    }

    const enc = getEncoding("gpt2");
    const newTokens = enc.encode(prompt).length;

    const now = new Date();
    if (tokenLimit.reset_date < now) {
      const nextReset = new Date(now);
      nextReset.setHours(now.getHours() + 24);

      await updateTokenLimit({
        user_id: userId,
        tokens_used: newTokens,
        reset_date: nextReset,
      });
    } else {
      const totalTokens = tokenLimit.tokens_used + newTokens;
      if (totalTokens > tokenLimit.token_limit) {
        throw new Error("Token limit exceeded");
      }

      await updateTokenLimit({
        user_id: userId,
        tokens_used: totalTokens,
        reset_date: tokenLimit.reset_date,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return {
      answer: completion.choices[0].message.content || "",
      notes: data,
    };
  } catch (error) {
    console.error(`chatgpt error: ${error}`);
    throw error;
  }
};

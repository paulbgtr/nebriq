"use server";

import OpenAI from "openai";
import { ChatContext } from "@/types/chat";
import { handleTokenLimits } from "./utils";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in environment");
}

/**
 * Creates a prompt for the LLM using the given context.
 */
const createPrompt = (query: string, chatContext?: ChatContext): string => {
  let prompt = `You are Briq, a concise learning assistant. Your role is to help users learn from their notes through:
1. Brief, clear explanations (2-3 sentences)
2. Quick knowledge checks (1-2 focused questions)
3. Identifying specific gaps in notes

Rules:
- Keep all responses under 100 words
- Only use information from provided notes
- Start responses with "Based on your notes..."
- If notes lack information, say "Your notes need more details about..."`;

  // Add relevant notes context
  if (chatContext?.relevantNotes?.length) {
    prompt += `\n\nNOTES:\n${chatContext.relevantNotes
      .map((note) => `${note.title}: ${note.content}`)
      .join("\n")}`;
  }

  // Add minimal conversation history for context
  if (chatContext?.conversationHistory?.length) {
    const lastTwoTurns = chatContext.conversationHistory.slice(-2);
    prompt += `\n\nLAST EXCHANGE:\n${lastTwoTurns
      .map((turn) => `${turn.role}: ${turn.content}`)
      .join("\n")}`;
  }

  prompt += `\n\nQUESTION: ${query}`;

  return prompt;
};

export const chat = async (
  query: string,
  userId: string,
  followUpContext?: ChatContext,
  signal?: AbortSignal
): Promise<string | null> => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const prompt = createPrompt(query, followUpContext);

    await handleTokenLimits(userId, prompt);

    const completion = await openai.chat.completions.create(
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        stream: true,
      },
      { signal }
    );

    let result = "";
    for await (const chunk of completion) {
      if (signal?.aborted) {
        throw new Error("Request aborted");
      }
      result += chunk.choices[0]?.delta?.content || "";
    }

    return result || null;
  } catch (error) {
    if ((error as Error).message === "Request aborted") {
      return "Response stopped by user.";
    }
    console.error(`chatgpt error: ${error}`);
    throw error;
  }
};

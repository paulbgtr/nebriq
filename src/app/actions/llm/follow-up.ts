"use server";

import OpenAI from "openai";
import { FollowUpContext } from "@/types/follow-up";
import { handleTokenLimits } from "./utils";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in environment");
}

/**
 * Creates a prompt for the LLM using the given context.
 */
const createPrompt = (
  query: string,
  followUpContext?: FollowUpContext
): string => {
  let prompt = `You are a helpful assistant answering questions about the user's notes. The user can see the notes on their screen, so don't summarize them.`;

  if (followUpContext?.relevantNotes?.length) {
    prompt += `\n\nRelevant notes:\n${followUpContext.relevantNotes
      .map((note) => `Title: ${note.title}\nContent: ${note.content}\n---`)
      .join("\n")}`;
  }

  if (followUpContext?.conversationHistory.length) {
    prompt += `\n\nPrevious conversation:\n${followUpContext.conversationHistory
      .map((turn) => `${turn.role}: ${turn.content}`)
      .join("\n")}`;
  }

  prompt += `\n\nUser's question: ${query}`;

  prompt += `\n\nProvide a clear and direct answer to the user's question. If you need to reference specific notes, mention them by title.`;

  return prompt;
};

export const followUp = async (
  query: string,
  userId: string,
  followUpContext?: FollowUpContext,
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
        model: "gpt-4",
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

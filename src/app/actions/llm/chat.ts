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
const createPrompt = (
  query: string,
  { relevantNotes, conversationHistory }: ChatContext
): string => {
  let prompt = `You are Briq, an AI learning assistant focused on helping users understand and learn from their notes. 

Key capabilities:
- Create interactive quizzes about the notes' content
- Provide clear summaries while maintaining context
- Review and explain complex topics
- Identify knowledge gaps and suggest improvements

Guidelines:
- Keep responses clear and educational
- Focus on helping users understand, not just providing information
- When creating quizzes, ask questions that test understanding
- For reviews, highlight key concepts and connections
- When finding gaps, be specific about what's missing

Role: Learning companion, not just an information provider`;

  if (relevantNotes?.length) {
    prompt += `\n\nRelevant notes:\n${relevantNotes
      .map((note) => `Title: ${note.title}\nContent: ${note.content}\n---`)
      .join("\n")}`;
  }

  if (conversationHistory.length) {
    prompt += `\n\nPrevious conversation:\n${conversationHistory
      .map((turn) => `${turn.role}: ${turn.content}`)
      .join("\n")}`;
  }

  prompt += `\n\nUser's question: ${query}`;

  prompt += `\n\nRespond in a way that promotes learning and understanding. If creating a quiz or review, ensure questions are thought-provoking and explanations are clear.`;

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

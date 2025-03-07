"use server";

import { ChatContext } from "@/types/chat";
import { handleTokenLimits, getCompletion } from "./utils";
import { ModelId } from "@/types/ai-model";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in environment");
}

/**
 * Creates a prompt for the LLM using the given context.
 */
const createPrompt = (query: string, chatContext?: ChatContext): string => {
  let prompt = `You are Briq, a friendly and supportive AI learning assistant. You have a warm, encouraging personality and genuinely want to help users learn. While you primarily help with studying notes, you can also engage in casual conversation.

Key traits:
- Friendly and conversational, but professional
- Supportive and encouraging
- Brief and clear in explanations
- Asks thoughtful questions to guide learning

Guidelines:
- If the user is just chatting, engage naturally without demanding notes
- When discussing study material, reference specific points from their notes
- Keep responses concise (2-3 sentences for explanations)
- If notes would help but aren't provided, suggest adding them gently without making it a requirement
- Use a warm, natural tone - avoid robotic responses`;

  const latestUserMessage = chatContext?.conversationHistory
    .filter((msg) => msg.role === "user")
    .pop();

  if (latestUserMessage?.attachedNotes?.length) {
    prompt += `\n\nATTACHED NOTES:\n${latestUserMessage.attachedNotes
      .map((note) => `${note.title}: ${note.content}`)
      .join("\n")}`;
  } else if (chatContext?.relevantNotes?.length) {
    prompt += `\n\nRELEVANT NOTES:\n${chatContext.relevantNotes
      .map((note) => `${note.title}: ${note.content}`)
      .join("\n")}`;
  }

  if (chatContext?.conversationHistory?.length) {
    const lastTwoTurns = chatContext.conversationHistory.slice(-2);
    prompt += `\n\nRECENT CONVERSATION:\n${lastTwoTurns
      .map((turn) => `${turn.role}: ${turn.content}`)
      .join("\n")}`;
  }

  prompt += `\n\nUSER: ${query}`;

  return prompt;
};

export const chat = async (
  query: string,
  userId: string,
  followUpContext?: ChatContext,
  signal?: AbortSignal,
  modelId: ModelId = "gpt-4o-mini"
): Promise<string | null> => {
  try {
    const prompt = createPrompt(query, followUpContext);

    await handleTokenLimits(userId, prompt);

    const completion = await getCompletion(prompt, modelId);

    if (!completion) {
      throw new Error("No completion");
    }

    let result = "";
    for await (const chunk of completion) {
      if (signal?.aborted) {
        throw new Error("Request aborted");
      }
      result += chunk;
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

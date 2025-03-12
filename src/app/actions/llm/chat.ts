"use server";

import { ChatContext } from "@/types/chat";
import { handleTokenLimits } from "./utils";
import { ModelId } from "@/types/ai-model";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { ChatOpenAI } from "@langchain/openai";
import { ChatXAI } from "@langchain/xai";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
import { ChatAnthropic } from "@langchain/anthropic";
import { RunnableSequence } from "@langchain/core/runnables";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in environment");
}

/**
 * Creates a LangChain prompt template for the chat.
 */
const createPromptTemplate = () => {
  const systemTemplate = `You are Briq, a friendly and supportive AI learning assistant. You have a warm, encouraging personality and genuinely want to help users learn. While you primarily help with studying notes, you can also engage in casual conversation.

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

  return ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(systemTemplate),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);
};

/**
 * Prepares the input for the prompt template with all relevant context.
 */
const prepareInput = (query: string, chatContext?: ChatContext): string => {
  let input = query;

  const latestUserMessage = chatContext?.conversationHistory
    .filter((msg) => msg.role === "user")
    .pop();

  if (latestUserMessage?.attachedNotes?.length) {
    input += `\n\nATTACHED NOTES:\n${latestUserMessage.attachedNotes
      .map((note) => `${note.title}: ${note.content}`)
      .join("\n")}`;
  } else if (chatContext?.relevantNotes?.length) {
    input += `\n\nRELEVANT NOTES:\n${chatContext.relevantNotes
      .map((note) => `${note.title}: ${note.content}`)
      .join("\n")}`;
  }

  if (chatContext?.conversationHistory?.length) {
    const lastTwoTurns = chatContext.conversationHistory.slice(-2);
    input += `\n\nRECENT CONVERSATION:\n${lastTwoTurns
      .map((turn) => `${turn.role}: ${turn.content}`)
      .join("\n")}`;
  }

  return input;
};

/**
 * Gets the appropriate LangChain model based on model ID.
 */
const getLLM = (modelId: ModelId) => {
  const llmname = modelId.split("-")[0];
  const model = modelId;
  const maxTokens = 4000;

  if (llmname === "gpt" || llmname === "o3") {
    return new ChatOpenAI({ model });
  } else if (llmname === "grok") {
    return new ChatXAI({ model, maxTokens });
  } else if (llmname === "mistral") {
    return new ChatMistralAI({ model, maxTokens });
  } else if (llmname === "gemini") {
    return new ChatGoogleGenerativeAI({ model });
  } else if (llmname === "meta" || llmname === "deepseek") {
    return new ChatTogetherAI({ model });
  } else if (llmname === "claude") {
    return new ChatAnthropic({ model });
  } else {
    return new ChatOpenAI({ model: "gpt-4o-mini" });
  }
};

export const chat = async (
  query: string,
  userId: string,
  followUpContext?: ChatContext,
  signal?: AbortSignal,
  modelId: ModelId = "gpt-4o-mini"
): Promise<string | null> => {
  try {
    const input = prepareInput(query, followUpContext);

    await handleTokenLimits(userId, input);

    const llm = getLLM(modelId);

    const promptTemplate = createPromptTemplate();

    const chain = RunnableSequence.from([
      promptTemplate,
      llm,
      new StringOutputParser(),
    ]);

    const stream = await chain.stream({
      input,
    });

    let result = "";
    for await (const chunk of stream) {
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
    console.error(`chat error: ${error}`);
    throw error;
  }
};

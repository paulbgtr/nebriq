"use server";

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { ModelId } from "@/types/ai-model";

type SummaryOptions = {
  text: string;
  modelId?: ModelId;
  maxLength?: number;
  prompt?: string;
};

/**
 * Generates a summary of the provided text using MistralAI
 */
export async function summarizeText({
  text,
  modelId = "gpt-4o-mini",
  maxLength = 500,
  prompt,
}: SummaryOptions): Promise<string | null> {
  try {
    if (!text || text.trim().length === 0) {
      return null;
    }

    const model = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: modelId,
    });

    const promptText =
      prompt ||
      `
    Provide a concise, useful summary of the following text in no more than ${maxLength} characters.
    
    Text to summarize:
    ${text}
    `;

    const response = await model.invoke([new HumanMessage(promptText)]);

    return response.content as string;
  } catch (error) {
    console.error(`Summarization error: ${error}`);
    throw error;
  }
}

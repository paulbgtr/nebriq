"use server";

import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage } from "@langchain/core/messages";
import { ModelId } from "@/types/ai-model";

type SummaryOptions = {
  text: string;
  modelId?: ModelId;
  maxLength?: number;
};

/**
 * Generates a summary of the provided text using MistralAI
 */
export async function summarizeText({
  text,
  modelId = "mistral-small",
  maxLength = 500,
}: SummaryOptions): Promise<string | null> {
  try {
    if (!text || text.trim().length === 0) {
      return null;
    }

    const model = new ChatMistralAI({
      apiKey: process.env.MISTRAL_API_KEY,
      modelName: modelId,
    });

    const promptText = `
    Provide a concise, useful summary of the following text in no more than ${maxLength} characters.
    
    IMPORTANT: 
    - Return ONLY the summary itself. Do NOT include phrases like "The text is about" or any commentary.
    - For very short inputs or single words, provide a brief definition or contextual meaning.
    - Never say there's not enough text to summarize.
    
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

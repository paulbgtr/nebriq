"use server";

import { InferenceClient } from "@huggingface/inference";

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!HUGGINGFACE_API_KEY) {
  throw new Error("HUGGINGFACE_API_KEY is not set");
}

const hf = new InferenceClient(HUGGINGFACE_API_KEY);

/**
 * Generates a short summary title from the provided text (e.g., chat messages).
 *
 * @param {string} text - The input text to summarize.
 * @returns {Promise<string>} A short summary title.
 * @throws Will throw an error if summarization fails.
 */
export const generateChatTitle = async (text: string): Promise<string> => {
  try {
    const result = await hf.summarization({
      model: "facebook/bart-large-cnn",
      inputs: text,
      parameters: {
        max_length: 15,
        min_length: 4,
        do_sample: false,
      },
    });

    return result.summary_text;
  } catch (error) {
    console.error("Error generating chat title:", error);
    throw error;
  }
};

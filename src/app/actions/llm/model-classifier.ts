"use server";

import { InferenceClient } from "@huggingface/inference";

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!HUGGINGFACE_API_KEY) {
  throw new Error("HUGGINGFACE_API_KEY is not set");
}

const hf = new InferenceClient(HUGGINGFACE_API_KEY);

/**
 * Classifies the given query using the specified model.
 *
 * @param {string} query - The input query to classify.
 * @returns {Promise<string>} The classification result.
 * @throws Will throw an error if the classification fails.
 */
export const classifyModel = async (query: string): Promise<string> => {
  try {
    const result = await hf.textClassification({
      model: "paulbg/nebriq-model-classifier",
      inputs: query,
    });
    return result[0].label;
  } catch (error) {
    console.error("Error classifying model:", error);
    throw error;
  }
};

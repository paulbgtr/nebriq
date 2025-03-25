"use server";

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in environment");
}

export const transcribe = async (imageData: string): Promise<string | null> => {
  try {
    const llm = new ChatOpenAI({ model: "gpt-4o-mini" });

    const message = new HumanMessage({
      content: [
        {
          type: "text",
          text: "transcribe this image. use markdown formatting, dont include the ```markdown``` tags.",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${imageData}`,
          },
        },
      ],
    });

    const response = await llm.invoke([message]);

    return response.content.toString() || null;
  } catch (error) {
    if ((error as Error).message === "Request aborted") {
      return "Response stopped by user.";
    }
    console.error(`chat error: ${error}`);
    throw error;
  }
};

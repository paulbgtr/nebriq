"use server";

import { LLMMode } from "@/types/chat";
import { ModelId } from "@/types/ai-model";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { PostgresChatMessageHistory } from "@langchain/community/stores/message/postgres";
import { pool } from "@/shared/lib/db/pool";
import { noteSchema } from "../../../shared/lib/schemas/note";
import { z } from "zod";
import { createPromptTemplate } from "./prompt";
import { createNoteTool, searchNotes } from "./tools";
import { createAgent } from "./agent";
import { handleTokenLimits } from "./utils";

type Note = z.infer<typeof noteSchema>;

type ChatVariables = {
  query: string;
  userId: string;
  modelId?: ModelId;
  mode?: LLMMode;
  sessionId?: string;
  attachedNotes?: Note[];
};

export const chat = async ({
  query,
  userId,
  modelId = "gpt-4o-mini",
  mode = "standard",
  sessionId,
  attachedNotes,
}: ChatVariables): Promise<string | null> => {
  try {
    const normalizedNotes = attachedNotes
      ? attachedNotes.map(
          (note) => `Title: ${note.title}, Content: ${note.content}`
        )
      : [];

    const prompt = createPromptTemplate(mode, normalizedNotes);

    await handleTokenLimits(userId, modelId);

    const tools = [searchNotes(userId), createNoteTool(userId)];

    // @ts-expect-error - this is a workaround to avoid type errors
    const agent = await createAgent({ modelId, prompt, tools });

    const chatSessionId = sessionId || userId;

    const chainWithHistory = new RunnableWithMessageHistory({
      runnable: agent,
      inputMessagesKey: "input",
      historyMessagesKey: "chat_history",
      getMessageHistory: async () => {
        const chatHistory = new PostgresChatMessageHistory({
          sessionId: chatSessionId,
          pool,
          tableName: "messages",
        });
        return chatHistory;
      },
    });

    const result = await chainWithHistory.invoke(
      { input: query },
      { configurable: { sessionId: chatSessionId } }
    );

    // await pool.end();

    return result.output || null;
  } catch (error) {
    if ((error as Error).message === "Request aborted") {
      return "Response stopped by user.";
    }
    console.error(`chat error: ${error}`);
    throw error;
  }
};

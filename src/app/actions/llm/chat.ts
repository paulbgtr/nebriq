"use server";

import { LLMMode } from "@/types/chat";
import { ModelId } from "@/types/ai-model";
import { runAgent } from "@/app/actions/llm/agent";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { PostgresChatMessageHistory } from "@langchain/community/stores/message/postgres";
import { pool } from "@/shared/lib/db/pool";

export const chat = async (
  query: string,
  userId: string,
  modelId: ModelId = "gpt-4o-mini",
  mode: LLMMode = "standard",
  sessionId?: string
): Promise<string | null> => {
  try {
    const agent = await runAgent(modelId, mode, userId);

    const chatSessionId = sessionId || userId;

    console.log(`Using session ID for chat: ${chatSessionId}`);

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

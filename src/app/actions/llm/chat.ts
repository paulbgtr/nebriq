"use server";

import { ChatContext, LLMMode } from "@/types/chat";
import { ModelId } from "@/types/ai-model";
import { runAgent } from "@/app/actions/llm/agent";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { PostgresChatMessageHistory } from "@langchain/community/stores/message/postgres";
import { pool } from "@/shared/lib/db/pool";

export const chat = async (
  query: string,
  userId: string,
  context?: ChatContext,
  signal?: AbortSignal,
  modelId: ModelId = "gpt-4o-mini",
  mode: LLMMode = "standard"
): Promise<string | null> => {
  try {
    const agent = await runAgent(query, modelId, mode, userId);

    const chainWithHistory = new RunnableWithMessageHistory({
      runnable: agent,
      inputMessagesKey: "input",
      historyMessagesKey: "chat_history",
      getMessageHistory: async (sessionId) => {
        const chatHistory = new PostgresChatMessageHistory({
          sessionId,
          pool,
          tableName: "messages",
        });
        return chatHistory;
      },
    });

    const result = await chainWithHistory.invoke(
      { input: query },
      { configurable: { sessionId: userId } }
    );

    await pool.end();

    return result.output || null;
  } catch (error) {
    if ((error as Error).message === "Request aborted") {
      return "Response stopped by user.";
    }
    console.error(`chat error: ${error}`);
    throw error;
  }
};

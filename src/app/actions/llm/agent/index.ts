import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { searchNotes } from "./tools";
import { LLMMode } from "@/types/chat";
import { createPromptTemplate } from "./prompt";
import { ChatOpenAI } from "@langchain/openai";
import { ModelId } from "@/types/ai-model";

export async function runAgent(
  modelId: ModelId,
  mode: LLMMode = "standard",
  userId: string
) {
  const llm = new ChatOpenAI({ modelName: modelId });

  const tools = [searchNotes(userId)];

  const agentPrompt = createPromptTemplate(mode);

  const agent = await createOpenAIToolsAgent({
    llm,
    tools,
    prompt: agentPrompt,
  });

  const executor = AgentExecutor.fromAgentAndTools({
    agent,
    tools,
  });

  return executor;
}

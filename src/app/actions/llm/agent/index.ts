import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { searchNotes } from "./tools";
import { LLMMode } from "@/types/chat";
import { createPromptTemplate } from "./prompt";
import { ChatOpenAI } from "@langchain/openai";

export async function runAgent(
  input: string,
  modelId = "gpt-4o-mini",
  mode: LLMMode = "standard",
  userId: string
) {
  const llm = new ChatOpenAI({ modelName: "gpt-4o-mini" });

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

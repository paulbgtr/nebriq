import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { ChatOpenAI } from "@langchain/openai";
import { searchNotes } from "./tools";
import { LLMMode } from "@/types/chat";
import { createPromptTemplate } from "./prompt";

export async function runAgent(
  input: string,
  modelId = "gpt-4o-mini",
  mode: LLMMode = "standard"
) {
  const llm = new ChatOpenAI({ modelName: "gpt-4o-mini" });

  const tools = [searchNotes];

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

  const result = await executor.invoke({ input });

  return result.output;
}

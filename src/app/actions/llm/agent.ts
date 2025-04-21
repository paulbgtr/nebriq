import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { ChatOpenAI } from "@langchain/openai";
import { ModelId } from "@/types/ai-model";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { DynamicStructuredTool } from "@langchain/core/tools";

type AgentVariables = {
  modelId: ModelId;
  prompt: ChatPromptTemplate;
  tools: DynamicStructuredTool[];
};

export async function createAgent({ modelId, prompt, tools }: AgentVariables) {
  const llm = new ChatOpenAI({ modelName: modelId });

  const agent = await createOpenAIToolsAgent({
    llm,
    tools,
    prompt,
  });

  const executor = AgentExecutor.fromAgentAndTools({
    agent,
    tools,
  });

  return executor;
}

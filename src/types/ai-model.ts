export type ModelId = "gpt-4o-mini" | "gpt-4o" | "grok-2" | "mistral-medium";

export type AIModel = {
  id: ModelId;
  name: string;
  description: string;
  available: boolean;
};

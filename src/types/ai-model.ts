export type ModelId =
  | "gpt-4o-mini"
  | "gpt-4o"
  | "o3-mini"
  | "grok-2"
  | "mistral-medium"
  | "mistral-small"
  | "gemini-1.5-pro"
  | "gemini-1.5-flash"
  | "meta-llama/Llama-3.3-70B-Instruct-Turbo"
  | "deepseek-ai/DeepSeek-V3";

export type ModelCategory = "Beginner" | "Advanced" | "Specialized";

export type ModelCapability =
  | "Fast"
  | "Smart"
  | "Creative"
  | "Balanced"
  | "Realtime";

export type AIModel = {
  id: ModelId;
  name: string;
  description: string;
  available: boolean;
  isOpenSource: boolean;
  category: ModelCategory;
  capabilities: ModelCapability[];
  technicalDetails?: string; // For power users
};

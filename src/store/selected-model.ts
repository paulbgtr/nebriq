import { create } from "zustand";

export type AIModel = {
  id: string;
  name: string;
  description: string;
  available: boolean;
};

export const models: AIModel[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Fast and efficient for most tasks",
    available: true,
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Advanced reasoning and knowledge",
    available: true,
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    description: "Balanced performance and capabilities",
    available: false,
  },
  {
    id: "claude-3-opus",
    name: "Claude 3 Opus",
    description: "Highest quality for complex tasks",
    available: false,
  },
];

type SelectedModelState = {
  selectedModel: AIModel;
  setSelectedModel: (model: AIModel) => void;
};

export const useSelectedModelStore = create<SelectedModelState>((set) => ({
  selectedModel: models[0],
  setSelectedModel: (model) => set({ selectedModel: model }),
}));

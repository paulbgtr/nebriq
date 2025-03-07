import { create } from "zustand";
import { AIModel } from "@/types/ai-model";

export const models: AIModel[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description:
      "Fast and affordable for everyday tasks. Best for quick responses.",
    available: true,
    isOpenSource: false,
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Advanced reasoning for complex topics and in-depth analysis.",
    available: true,
    isOpenSource: false,
  },
  {
    id: "grok-2",
    name: "Grok 2",
    description:
      "Balanced with real-time information. Ideal for current events.",
    available: true,
    isOpenSource: false,
  },
  {
    id: "mistral-medium",
    name: "Mistral Medium",
    description: "Balanced performance with real-time information.",
    available: true,
    isOpenSource: true,
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

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AIModel } from "@/types/ai-model";

export const models: AIModel[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description:
      "Fast and affordable for everyday tasks. Best for quick responses.",
    available: true,
    isOpenSource: false,
    category: "Beginner",
    capabilities: ["Fast", "Balanced"],
    technicalDetails: "OpenAI's lightweight model with 8K context window",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Advanced reasoning for complex topics and in-depth analysis.",
    available: true,
    isOpenSource: false,
    category: "Advanced",
    capabilities: ["Smart", "Creative"],
    technicalDetails: "OpenAI's flagship model with 128K context window",
  },
  {
    id: "grok-2",
    name: "Grok 2",
    description:
      "Balanced with real-time information. Ideal for current events.",
    available: true,
    isOpenSource: false,
    category: "Specialized",
    capabilities: ["Realtime", "Smart"],
    technicalDetails: "xAI's model with real-time web access",
  },
  {
    id: "mistral-medium",
    name: "Mistral Medium",
    description: "Balanced performance with real-time information.",
    available: true,
    isOpenSource: true,
    category: "Advanced",
    capabilities: ["Balanced", "Smart"],
    technicalDetails: "Mistral AI's 7B parameter open source model",
  },
  {
    id: "mistral-small",
    name: "Mistral Small",
    description: "Small and fast for basic tasks.",
    available: true,
    isOpenSource: true,
    category: "Beginner",
    capabilities: ["Fast"],
    technicalDetails: "Mistral AI's lightweight 3B parameter open source model",
  },
];

type SelectedModelState = {
  selectedModel: AIModel;
  setSelectedModel: (model: AIModel) => void;
};

const ensureModelProperties = (model: AIModel): AIModel => {
  const currentModel = models.find((m) => m.id === model.id);

  if (currentModel) {
    return currentModel;
  }

  return models[0];
};

export const useSelectedModelStore = create<SelectedModelState>()(
  persist(
    (set) => ({
      selectedModel: models[0],
      setSelectedModel: (model) => set({ selectedModel: model }),
    }),
    {
      name: "selected-model-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedModel: ensureModelProperties(state.selectedModel),
      }),
    }
  )
);

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AIModel } from "@/types/ai-model";

export const models: AIModel[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Fast, affordable, ideal for simple tasks.",
    available: true,
    isOpenSource: false,
    category: "Beginner",
    capabilities: ["Fast", "Balanced"],
    technicalDetails: "OpenAI's lightweight model with 8K context window",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Advanced reasoning for complex, in-depth tasks.",
    available: true,
    isOpenSource: false,
    category: "Advanced",
    capabilities: ["Smart", "Creative"],
    technicalDetails: "OpenAI's flagship model with 128K context window",
  },
  {
    id: "o3-mini",
    name: "O3 Mini",
    description: "STEM-focused with strong math and coding skills.",
    available: true,
    isOpenSource: false,
    category: "Specialized",
    capabilities: ["Smart", "Fast"],
    technicalDetails:
      "OpenAI's specialized STEM reasoning model with function calling support and 8K context window",
  },
  {
    id: "grok-2",
    name: "Grok 2",
    description: "Real-time info for current events.",
    available: true,
    isOpenSource: false,
    category: "Specialized",
    capabilities: ["Realtime", "Smart"],
    technicalDetails: "xAI's model with real-time web access",
  },
  {
    id: "mistral-medium",
    name: "Mistral Medium",
    description: "Balanced, open-source for advanced language tasks.",
    available: true,
    isOpenSource: true,
    category: "Advanced",
    capabilities: ["Balanced", "Smart"],
    technicalDetails: "Mistral AI's 7B parameter open source model",
  },
  {
    id: "mistral-small",
    name: "Mistral Small",
    description: "Lightweight, open-source for quick basic tasks.",
    available: true,
    isOpenSource: true,
    category: "Beginner",
    capabilities: ["Fast"],
    technicalDetails: "Mistral AI's lightweight 3B parameter open source model",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    description: "Multimodal with huge 2M token context for deep analysis.",
    available: true,
    isOpenSource: false,
    category: "Advanced",
    capabilities: ["Smart", "Creative", "Balanced"],
    technicalDetails:
      "Google's flagship model with 2 million token context window and multimodal capabilities",
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    description: "Fast multimodal with 1M token context for efficiency.",
    available: true,
    isOpenSource: false,
    category: "Beginner",
    capabilities: ["Fast", "Balanced"],
    technicalDetails:
      "Google's efficient model optimized for speed with 1 million token context window",
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

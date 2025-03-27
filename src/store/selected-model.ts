import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AIModel, ModelCapability } from "@/types/ai-model";
import { models } from "@/shared/data/models";
import { classifyModel } from "@/app/actions/llm/model-classifier";

export const complexityToCapabilities: Record<string, ModelCapability[]> = {
  simple: ["Fast", "Balanced"],
  balanced: ["Balanced", "Smart"],
  advanced: ["Smart", "Creative"],
};

type SelectedModelState = {
  selectedModel: AIModel;
  isAutoMode: boolean;
  setSelectedModel: (model: AIModel) => void;
  setAutoMode: (isAuto: boolean) => void;
  getModelForQuery: (query: string) => Promise<AIModel>;
};

const ensureModelProperties = (model: AIModel): AIModel => {
  const currentModel = models.find((m) => m.id === model.id);

  if (currentModel) {
    return currentModel;
  }

  return models[0];
};

/**
 * Checks if the query is trivial (e.g., a simple greeting or very short)
 * and returns a default classification if so. Otherwise, returns null.
 */
export function filterSimpleQuery(query: string): string | null {
  const trivialKeywords = ["hi", "hello", "hey", "what's up", "howdy"];
  const trimmedQuery = query.trim().toLowerCase();

  if (trimmedQuery.split(/\s+/).length < 3) {
    return "simple";
  }

  for (const keyword of trivialKeywords) {
    if (trimmedQuery === keyword || trimmedQuery.startsWith(`${keyword} `)) {
      return "simple";
    }
  }

  return null;
}

const selectModelForComplexity = (complexity: string): AIModel => {
  const requiredCapabilities =
    complexityToCapabilities[complexity] || complexityToCapabilities.simple;

  const modelsAvailableForAutoMode = models.filter(
    (model) => model.id.split("-")[0] === "mistral"
  );

  const candidateModels = modelsAvailableForAutoMode.filter(
    (model) =>
      model.available &&
      requiredCapabilities.some((cap) => model.capabilities.includes(cap))
  );

  if (candidateModels.length === 0) {
    return modelsAvailableForAutoMode[0];
  }

  if (complexity === "advanced") {
    const advancedModels = candidateModels.filter(
      (m) => m.category === "Advanced"
    );
    if (advancedModels.length > 0) {
      return advancedModels[0];
    }
  }

  if (complexity === "balanced") {
    const balancedModels = candidateModels.filter(
      (m) => m.category === "Balanced"
    );
    if (balancedModels.length > 0) {
      return balancedModels[0];
    }
  }

  if (complexity === "simple") {
    const beginnerModels = candidateModels.filter(
      (m) => m.category === "Simple"
    );
    if (beginnerModels.length > 0) {
      return beginnerModels[0];
    }
  }

  return candidateModels[0];
};

export const useSelectedModelStore = create<SelectedModelState>()(
  persist(
    (set) => ({
      selectedModel: models[0],
      isAutoMode: true,
      setSelectedModel: (model) => set({ selectedModel: model }),
      setAutoMode: (isAuto) => set({ isAutoMode: isAuto }),
      getModelForQuery: async (query) => {
        let complexity = filterSimpleQuery(query);
        if (!complexity) {
          complexity = await classifyModel(query);
        }
        const model = selectModelForComplexity(complexity);
        return model;
      },
    }),
    {
      name: "selected-model-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedModel: ensureModelProperties(state.selectedModel),
        isAutoMode: state.isAutoMode,
      }),
    }
  )
);

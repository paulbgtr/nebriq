import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AIModel, ModelCapability } from "@/types/ai-model";
import { models } from "@/shared/data/models";

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
  getModelForQuery: (query: string) => AIModel;
};

const ensureModelProperties = (model: AIModel): AIModel => {
  const currentModel = models.find((m) => m.id === model.id);

  if (currentModel) {
    return currentModel;
  }

  return models[0];
};

const analyzeQueryComplexity = (query: string): string => {
  const queryLower = query.toLowerCase();

  if (
    queryLower.includes("latest") ||
    queryLower.includes("current") ||
    queryLower.includes("today") ||
    queryLower.includes("news") ||
    queryLower.includes("recent")
  ) {
    return "realtime";
  }

  const complexIndicators = [
    "explain in detail",
    "analyze",
    "compare",
    "why does",
    "how would",
    "implement",
    "design",
    "architecture",
    "complex",
    "difficult",
    "advanced",
    "research",
    "theory",
    "proof",
    "creative",
    "innovative",
  ];

  const mediumIndicators = [
    "describe",
    "explain",
    "what is",
    "how to",
    "define",
    "summarize",
    "outline",
    "guide",
  ];

  const complexCount = complexIndicators.filter((indicator) =>
    queryLower.includes(indicator)
  ).length;

  const mediumCount = mediumIndicators.filter((indicator) =>
    queryLower.includes(indicator)
  ).length;

  if (complexCount > 0 || query.length > 200) {
    return "complex";
  } else if (mediumCount > 0 || query.length > 100) {
    return "medium";
  }

  return "simple";
};

const selectModelForComplexity = (complexity: string): AIModel => {
  const requiredCapabilities =
    complexityToCapabilities[complexity] || complexityToCapabilities.simple;

  const candidateModels = models.filter(
    (model) =>
      model.available &&
      requiredCapabilities.some((cap) => model.capabilities.includes(cap))
  );

  if (candidateModels.length === 0) {
    return models[0];
  }

  if (complexity === "complex") {
    const advancedModels = candidateModels.filter(
      (m) => m.category === "Advanced"
    );
    if (advancedModels.length > 0) {
      return advancedModels[0];
    }
  }

  if (complexity === "realtime") {
    const realtimeModels = candidateModels.filter((m) =>
      m.capabilities.includes("Realtime")
    );
    if (realtimeModels.length > 0) {
      return realtimeModels[0];
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
      getModelForQuery: (query) => {
        const complexity = analyzeQueryComplexity(query);
        return selectModelForComplexity(complexity);
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

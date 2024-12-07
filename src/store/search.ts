import { create } from "zustand";

interface SearchStore {
  isAiSearch: boolean;
  setIsAiSearch: () => void;
}

export const useSearchStore = create<SearchStore>()((set) => ({
  isAiSearch: false,
  setIsAiSearch: () => set((state) => ({ isAiSearch: !state.isAiSearch })),
}));

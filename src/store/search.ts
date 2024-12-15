import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SearchStore {
  isAiSearch: boolean;
  setIsAiSearch: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      isAiSearch: false,
      setIsAiSearch: () => set((state) => ({ isAiSearch: !state.isAiSearch })),
    }),
    {
      name: "search-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

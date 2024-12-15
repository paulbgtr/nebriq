import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ZenStore {
  isZenMode: boolean;
  setIsZenMode: (isZenMode: boolean) => void;
}

export const useZenStore = create<ZenStore>()(
  persist(
    (set) => ({
      isZenMode: false,
      setIsZenMode: (isZenMode: boolean) => set({ isZenMode }),
    }),
    {
      name: "zen-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

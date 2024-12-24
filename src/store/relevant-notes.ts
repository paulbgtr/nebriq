import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";

interface RelevantNotesStore {
  relevantNotes: z.infer<typeof noteSchema>[];
  setRelevantNotes: (relevantNotes: z.infer<typeof noteSchema>[]) => void;
}

export const useRelevantNotesStore = create<RelevantNotesStore>()(
  persist(
    (set) => ({
      relevantNotes: [],
      setRelevantNotes: (relevantNotes: z.infer<typeof noteSchema>[]) =>
        set({ relevantNotes }),
    }),
    {
      name: "relevant-notes-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

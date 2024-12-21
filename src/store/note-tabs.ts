import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";

type OpenNote = Omit<z.infer<typeof noteSchema>, "created_at" | "user_id">;

interface NoteTabsStore {
  openNotes: OpenNote[];
  setOpenNotes: (openNotes: OpenNote[]) => void;
}

export const useNoteTabsStore = create<NoteTabsStore>()(
  persist(
    (set) => ({
      openNotes: [],
      setOpenNotes: (openNotes: OpenNote[]) => set({ openNotes }),
    }),
    {
      name: "note-tabs-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

import { create } from "zustand";
import { ModelId } from "@/types/ai-model";
import { LLMMode } from "@/types/chat";
import { noteSchema } from "@/shared/lib/schemas/note";
import { z } from "zod";

export type PendingMessage = {
  content: string;
  model: ModelId;
  mode: LLMMode;
  attachedNotes: z.infer<typeof noteSchema>[];
  timestamp: number;
};

type PendingMessagesStore = {
  pendingMessages: Record<string, PendingMessage>;
  addPendingMessage: (chatId: string, message: PendingMessage) => void;
  removePendingMessage: (chatId: string) => void;
  getPendingMessage: (chatId: string) => PendingMessage | null;
  clearOldMessages: () => void;
};

export const usePendingMessagesStore = create<PendingMessagesStore>(
  (set, get) => ({
    pendingMessages: {},

    addPendingMessage: (chatId: string, message: PendingMessage) => {
      set((state) => ({
        pendingMessages: {
          ...state.pendingMessages,
          [chatId]: message,
        },
      }));
    },

    removePendingMessage: (chatId: string) => {
      set((state) => {
        const { [chatId]: _, ...rest } = state.pendingMessages;
        return { pendingMessages: rest };
      });
    },

    getPendingMessage: (chatId: string) => {
      return get().pendingMessages[chatId] || null;
    },

    clearOldMessages: () => {
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      set((state) => ({
        pendingMessages: Object.fromEntries(
          Object.entries(state.pendingMessages).filter(
            ([_, message]) => message.timestamp > fiveMinutesAgo
          )
        ),
      }));
    },
  })
);

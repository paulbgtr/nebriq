import { create } from "zustand";
import { ChatContext } from "@/types/chat";

export type ChatHistoryItem = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  context: ChatContext;
};

type ChatHistoryState = {
  chatHistory: ChatHistoryItem[];
  activeChatId: string | null;
  addChat: (context: ChatContext) => string;
  updateChat: (id: string, context: ChatContext) => void;
  deleteChat: (id: string) => void;
  setActiveChatId: (id: string | null) => void;
  getChatById: (id: string) => ChatHistoryItem | undefined;
};

export const useChatHistoryStore = create<ChatHistoryState>((set, get) => ({
  chatHistory: [],
  activeChatId: null,

  addChat: (context: ChatContext) => {
    const id = crypto.randomUUID();
    const now = new Date();
    const title = generateChatTitle(context);

    const newChat: ChatHistoryItem = {
      id,
      title,
      createdAt: now,
      updatedAt: now,
      context,
    };

    set((state) => ({
      chatHistory: [newChat, ...state.chatHistory],
      activeChatId: id,
    }));

    return id;
  },

  updateChat: (id, context) => {
    set((state) => ({
      chatHistory: state.chatHistory.map((chat) =>
        chat.id === id ? { ...chat, context, updatedAt: new Date() } : chat
      ),
    }));
  },

  deleteChat: (id) => {
    set((state) => ({
      chatHistory: state.chatHistory.filter((chat) => chat.id !== id),
      activeChatId: state.activeChatId === id ? null : state.activeChatId,
    }));
  },

  setActiveChatId: (id) => set({ activeChatId: id }),

  getChatById: (id) => get().chatHistory.find((chat) => chat.id === id),
}));

function generateChatTitle(context: ChatContext): string {
  const firstUserMessage = context.conversationHistory.find(
    (msg) => msg.role === "user"
  );
  const content = firstUserMessage?.content.trim() ?? "";
  return content.length > 30
    ? content.slice(0, 30) + "..."
    : content || "New Chat";
}

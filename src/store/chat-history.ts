import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

export const useChatHistoryStore = create<ChatHistoryState>()(
  persist(
    (set, get) => ({
      chatHistory: [],
      activeChatId: null,

      addChat: (context: ChatContext) => {
        const id = crypto.randomUUID();
        const title = generateChatTitle(context);
        const now = new Date();

        const newChat: ChatHistoryItem = {
          id,
          title,
          createdAt: now,
          updatedAt: now,
          context,
        };

        set((state) => {
          // Check if we already have a chat with the same content
          const existingChatIndex = state.chatHistory.findIndex(
            (chat) => JSON.stringify(chat.context) === JSON.stringify(context)
          );

          let updatedHistory = [...state.chatHistory];

          // If this is a duplicate, don't add it
          if (existingChatIndex !== -1) {
            return {
              chatHistory: updatedHistory,
              activeChatId: state.chatHistory[existingChatIndex].id,
            };
          }

          // Add the new chat to the beginning
          updatedHistory = [newChat, ...updatedHistory];

          // Keep only the 10 most recent chats
          if (updatedHistory.length > 10) {
            updatedHistory.length = 10;
          }

          return {
            chatHistory: updatedHistory,
            activeChatId: id,
          };
        });

        return id;
      },

      updateChat: (id: string, context: ChatContext) => {
        set((state) => {
          const chatToUpdate = state.chatHistory.find((chat) => chat.id === id);

          // If chat doesn't exist, don't update anything
          if (!chatToUpdate) return state;

          // Only update the content, not the position in the list
          return {
            chatHistory: state.chatHistory.map((chat) =>
              chat.id === id
                ? {
                    ...chat,
                    context,
                    // Only update the title if it's a new chat (no title or "New Chat")
                    title:
                      !chat.title || chat.title === "New Chat"
                        ? generateChatTitle(context)
                        : chat.title,
                    // Only update updatedAt if the content has changed
                    updatedAt:
                      JSON.stringify(chat.context) !== JSON.stringify(context)
                        ? new Date()
                        : chat.updatedAt,
                  }
                : chat
            ),
          };
        });
      },

      deleteChat: (id: string) => {
        set((state) => ({
          chatHistory: state.chatHistory.filter((chat) => chat.id !== id),
          activeChatId: state.activeChatId === id ? null : state.activeChatId,
        }));
      },

      setActiveChatId: (id: string | null) => {
        set({ activeChatId: id });
      },

      getChatById: (id: string) => {
        return get().chatHistory.find((chat) => chat.id === id);
      },
    }),
    {
      name: "chat-history-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Helper function to generate a title from the first user message
function generateChatTitle(context: ChatContext): string {
  const firstUserMessage = context.conversationHistory.find(
    (msg) => msg.role === "user"
  );

  if (!firstUserMessage) return "New Chat";

  const content = firstUserMessage.content.trim();

  // Limit to first 30 characters
  return content.length > 30 ? `${content.substring(0, 30)}...` : content;
}

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createChat,
  deleteChat,
  getMessagesForChat,
  getUserChats,
} from "@/app/actions/supabase/chat";
import { chat as sendChatMessageAction } from "@/app/actions/llm/chat";
import {
  chatSchema,
  chatHistoryElementSchema,
} from "@/shared/lib/schemas/chat-history";
import { z } from "zod";
import { useUser } from "./use-user";
import queryClient from "../lib/react-query";
import { ModelId } from "@/types/ai-model";
import { LLMMode } from "@/types/chat";
import { noteSchema } from "../lib/schemas/note";

type Note = z.infer<typeof noteSchema>;
type Chat = z.infer<typeof chatSchema>;
type ChatHistoryElement = z.infer<typeof chatHistoryElementSchema>;

type SendMessageVariables = {
  messageContent: string;
  chatId: string;
  userId: string;
  model?: ModelId;
  mode?: LLMMode;
  attachedNotes?: Note[];
};

type MutationContext = {
  previousChatHistory: ChatHistoryElement | undefined;
  queryKey: (string | undefined)[];
};

export const useChatHistoryElement = (chatId: string) => {
  return useQuery<ChatHistoryElement>({
    queryKey: ["chat-history-element", chatId],
    queryFn: async () => await getMessagesForChat(chatId),
    enabled: !!chatId,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

export const useSendMessage = () => {
  return useMutation<void, Error, SendMessageVariables, MutationContext>({
    mutationFn: async ({
      messageContent,
      chatId,
      userId,
      model,
      mode,
      attachedNotes,
    }) => {
      await sendChatMessageAction({
        query: messageContent,
        userId: userId,
        modelId: model,
        mode: mode,
        sessionId: chatId,
        attachedNotes: attachedNotes,
      });
    },

    onMutate: async (variables): Promise<MutationContext> => {
      const { chatId, messageContent, userId } = variables;
      const queryKey = ["chat-history-element", chatId];

      await queryClient.cancelQueries({ queryKey });

      const previousChatHistory =
        queryClient.getQueryData<ChatHistoryElement>(queryKey);

      queryClient.setQueryData<ChatHistoryElement | undefined>(
        queryKey,
        (old) => {
          const optimisticUserMessage = {
            id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
            message: { type: "human", content: messageContent },
            created_at: new Date().toISOString(),
            session_id: chatId,
          };
          const optimisticAssistantMessage = {
            id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
            message: { type: "ai", content: "..." },
            created_at: new Date().toISOString(),
            session_id: chatId,
            isLoading: true,
          };

          if (!old) {
            console.warn("Optimistic update on empty cache for", queryKey);
            return {
              id: chatId,
              user_id: userId,
              title: null,
              created_at: new Date().toISOString(),
              messages: [optimisticUserMessage, optimisticAssistantMessage],
            };
          }

          const newMessages = [
            ...(old.messages || []),
            optimisticUserMessage,
            optimisticAssistantMessage,
          ];

          return {
            ...old,
            messages: newMessages,
          };
        }
      );

      return { previousChatHistory, queryKey };
    },
    onError: (err, variables, context) => {
      if (context?.previousChatHistory) {
        queryClient.setQueryData(context.queryKey, context.previousChatHistory);
      }
      console.error("Error sending message:", err);
    },
    onSettled: (data, error, variables, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });
};

export const useChatHistory = () => {
  const { user } = useUser();

  const { data: chats, isLoading } = useChats(user?.id);

  const { mutateAsync: createChat, isPending: isCreatingChat } = useCreateChat(
    user?.id
  );
  const { mutate: deleteChat, isPending: isDeletingChat } = useDeleteChat();

  return {
    chats,
    isLoading,
    createChat,
    deleteChat,
    isCreatingChat,
    isDeletingChat,
  };
};

const useChats = (userId: string | undefined) => {
  return useQuery<Chat[]>({
    queryKey: ["chats", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User not found");

      return getUserChats(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};

const useCreateChat = (userId: string | undefined) => {
  return useMutation<Chat, Error, string>({
    mutationFn: async (title: string) => {
      if (!userId) throw new Error("User not found for creating chat");

      return createChat(userId, title);
    },
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ["chats", userId] });
      queryClient.setQueryData(["chat-history-element", newChat.id], {
        messages: [],
      });
    },
  });
};

const useDeleteChat = () => {
  return useMutation({
    mutationFn: async (chatId: string) => deleteChat(chatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

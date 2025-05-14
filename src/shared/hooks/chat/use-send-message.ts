import { ModelId } from "@/types/ai-model";
import { LLMMode } from "@/types/chat";
import { useMutation } from "@tanstack/react-query";
import queryClient from "../../lib/react-query";
import { noteSchema } from "../../lib/schemas/note";
import { chatHistoryElementSchema } from "../../lib/schemas/chat-history";
import { chat as sendChatMessageAction } from "@/app/actions/llm/chat";
import { z } from "zod";

type Note = z.infer<typeof noteSchema>;
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
            message: { type: "ai", content: "" },
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
    onError: (err, _, context) => {
      if (context?.previousChatHistory) {
        queryClient.setQueryData(context.queryKey, context.previousChatHistory);
      }
      console.error("Error sending message:", err);
    },
    onSettled: (_, __, ___, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });
};

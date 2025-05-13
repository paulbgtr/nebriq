"use client";

import { useEffect } from "react";
import { useSendMessage } from "@/shared/hooks/chat/use-send-message";
import { useUser } from "@/shared/hooks/data/use-user";
import { usePendingMessagesStore } from "@/store/pending-messages";

export const PendingMessageHandler = ({ chatId }: { chatId: string }) => {
  const { user } = useUser();
  const { mutate: sendMessage } = useSendMessage();
  const { getPendingMessage, removePendingMessage } = usePendingMessagesStore();

  useEffect(() => {
    const handlePendingMessage = () => {
      if (!user?.id) return;

      const pendingMessage = getPendingMessage(chatId);
      if (!pendingMessage) return;

      try {
        // Only process messages from the last 5 minutes
        const isRecent = Date.now() - pendingMessage.timestamp < 5 * 60 * 1000;
        if (!isRecent) {
          removePendingMessage(chatId);
          return;
        }

        sendMessage({
          messageContent: pendingMessage.content,
          chatId,
          userId: user.id,
          model: pendingMessage.model,
          mode: pendingMessage.mode,
          attachedNotes: pendingMessage.attachedNotes,
        });

        // Clean up
        removePendingMessage(chatId);
      } catch (error) {
        console.error("Error processing pending message:", error);
        removePendingMessage(chatId);
      }
    };

    handlePendingMessage();
  }, [chatId, user?.id, sendMessage, getPendingMessage, removePendingMessage]);

  return null;
};

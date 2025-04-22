"use client";

import { useChatHistoryElement } from "@/modules/chat/hooks/use-chat-history-element";
import { MessageBubble } from "@/modules/chat/components/message-bubble";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  chatId: string;
  isModelThinking?: boolean;
};

const ThinkingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex max-w-2xl mx-auto w-full mb-1"
  >
    <div className="flex space-x-1 items-center py-2 px-3 opacity-70">
      <motion.span
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        className="w-1.5 h-1.5 bg-primary/60 rounded-full"
      />
      <motion.span
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
        className="w-1.5 h-1.5 bg-primary/60 rounded-full"
      />
      <motion.span
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
        className="w-1.5 h-1.5 bg-primary/60 rounded-full"
      />
    </div>
  </motion.div>
);

export const ChatContent = ({ chatId, isModelThinking = false }: Props) => {
  const { data: chatHistoryElement, isLoading: isHistoryLoading } =
    useChatHistoryElement(chatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistoryElement?.messages, isModelThinking]);

  if (isHistoryLoading || !chatHistoryElement) {
    return (
      <div className="flex flex-col items-center justify-center h-[30vh]">
        <div className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-ping" />
      </div>
    );
  }

  const messages = chatHistoryElement.messages || [];

  if (messages.length === 0 && !isModelThinking) {
    return (
      <div className="flex flex-col items-center justify-center h-[30vh] text-muted-foreground/50 text-sm">
        No messages yet
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-2xl mx-auto space-y-3 pb-20">
      <AnimatePresence initial={false}>
        {messages.map((msg) => {
          const isUser = msg.message.type === "human";

          return (
            <motion.div
              key={msg.id.toString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageBubble
                role={isUser ? "user" : "assistant"}
                content={msg.message.content}
                renderMarkdown={msg.message.type !== "human"}
                className="w-full"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {isModelThinking && <ThinkingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
};

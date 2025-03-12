"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useChat } from "@/shared/hooks/use-chat";
import { useUser } from "@/shared/hooks/use-user";
import { useRelevantNotesStore } from "@/store/relevant-notes";
import { useNotes } from "@/shared/hooks/use-notes";
import { ChatContent } from "@/modules/home/features/chat/components/chat-content";
import {
  InputArea,
  InputAreaHandle,
} from "@/modules/home/features/chat/components/input-area";
import { Spinner } from "@/shared/components/spinner";
import { cn } from "@/shared/lib/utils";
import { Plus } from "lucide-react";

export default function HomeModule() {
  const [followUp, setFollowUp] = useState("");
  const [mounted, setMounted] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<InputAreaHandle>(null);

  const { getNotesQuery } = useNotes();
  const { relevantNotes, setRelevantNotes } = useRelevantNotesStore();
  const { data: allNotes, isLoading: isAllNotesLoading } = getNotesQuery;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (
      allNotes &&
      JSON.stringify(allNotes) !== JSON.stringify(relevantNotes)
    ) {
      setRelevantNotes(allNotes);
    }
  }, [allNotes, relevantNotes, setRelevantNotes]);

  const { user } = useUser();
  const { setQuery, chatContext, isLoading, clearChatContext } = useChat(
    user?.id,
    allNotes || []
  );

  const lastAssistantMessage = useMemo(
    () =>
      chatContext.conversationHistory
        .filter((msg) => msg.role === "assistant")
        .slice(-1)[0]?.content,
    [chatContext.conversationHistory]
  );

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && chatContext.conversationHistory.length > 0) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [chatContext.conversationHistory]);

  const handleNewChat = () => {
    clearChatContext();
    setTimeout(() => {
      if (inputAreaRef.current) {
        inputAreaRef.current.focusInput();
      }
    }, 100);
  };

  return (
    <article
      ref={chatContainerRef}
      role="main"
      className="fixed inset-0 top-16 flex flex-col bg-background"
    >
      <div className="absolute inset-0 flex flex-col max-w-5xl mx-auto w-full">
        {isAllNotesLoading ? (
          <div className="flex items-center justify-center flex-1">
            <Spinner size="sm" />
          </div>
        ) : (
          <div className="flex-1 flex h-full overflow-hidden">
            <div
              className={cn(
                "w-full flex flex-col h-full",
                mounted && !chatContext.conversationHistory.length
                  ? "justify-center"
                  : "justify-between"
              )}
            >
              {mounted && chatContext.conversationHistory.length > 0 && (
                <div className="w-full flex justify-center p-2">
                  <button
                    onClick={handleNewChat}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5",
                      "text-xs font-medium",
                      "rounded-md",
                      "bg-transparent",
                      "border border-border/20",
                      "text-muted-foreground hover:text-primary",
                      "transition-colors duration-150 ease-in-out",
                      "hover:border-border/50",
                      "focus:outline-none focus:ring-1 focus:ring-primary/30",
                      "aria-label-new-chat"
                    )}
                    aria-label="New Chat"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Chat</span>
                  </button>
                </div>
              )}

              <ChatContent
                scrollContainerRef={scrollContainerRef}
                chatContext={chatContext}
                displayedText={lastAssistantMessage}
                isLoading={isLoading}
              />

              <InputArea
                ref={inputAreaRef}
                followUp={followUp}
                setFollowUp={setFollowUp}
                setQuery={setQuery}
                isEmpty={!chatContext.conversationHistory.length}
              />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

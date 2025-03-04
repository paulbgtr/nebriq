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
import { PlusCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

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
  }, [allNotes]);

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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.06)_0%,transparent_70%)] animate-pulse-glow" />
      </div>
      <div className="absolute inset-0 flex flex-col max-w-5xl mx-auto w-full">
        {mounted && (
          <div className="absolute top-4 right-4 z-10">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleNewChat}
                  className={cn(
                    "flex items-center justify-center",
                    "w-9 h-9",
                    "rounded-full",
                    "bg-background/95",
                    "border border-border/30",
                    "text-muted-foreground hover:text-primary",
                    "shadow-sm",
                    "transition-all duration-200 ease-in-out",
                    "hover:scale-105 hover:shadow-md hover:border-primary/20",
                    "backdrop-blur-sm",
                    !chatContext.conversationHistory.length &&
                      "opacity-0 pointer-events-none"
                  )}
                  aria-label="New Chat"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>New Chat</TooltipContent>
            </Tooltip>
          </div>
        )}

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

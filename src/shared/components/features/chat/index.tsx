"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { MessageCircle } from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import { useTypewriter } from "@/hooks/use-typewriter";
import { useUser } from "@/hooks/use-user";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { useRelevantNotesStore } from "@/store/relevant-notes";
import { useNotes } from "@/hooks/use-notes";
import { ChatContent } from "./components/chat-content";
import { InputArea } from "./components/input-area";
import { ChatHeader } from "./components/header";
import { Spinner } from "../../spinner";

export default function AIChat() {
  const [followUp, setFollowUp] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { getNotesQuery } = useNotes();
  const { relevantNotes, setRelevantNotes } = useRelevantNotesStore();

  const { data: allNotes, isLoading: isAllNotesLoading } = getNotesQuery;

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

  const maxLength = 100;

  const lastAssistantMessage = useMemo(
    () =>
      chatContext.conversationHistory
        .filter((msg) => msg.role === "assistant")
        .slice(-1)[0]?.content,
    [chatContext.conversationHistory]
  );

  const { displayedText } = useTypewriter(lastAssistantMessage ?? "", 15);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && chatContext.conversationHistory.length > 0) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [chatContext.conversationHistory]);

  const ChatToggle = useMemo(
    () => (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-5 right-5 z-50",
          "flex items-center justify-center gap-2.5",
          "bg-primary/90 backdrop-blur-sm",
          "text-primary-foreground",
          "shadow-md",
          "transition-all duration-300 ease-out",
          "rounded-full",
          "animate-in fade-in zoom-in-95",
          "group",
          "md:px-6",
          "h-12 w-12 md:h-14 md:w-auto",
          "hover:bg-primary hover:translate-y-[-2px]"
        )}
        aria-label="Chat with Briq AI"
      >
        <MessageCircle className="w-5 h-5 md:h-6 md:w-6" />
        <span
          className={cn(
            "hidden md:inline font-medium",
            "transition-all duration-300",
            "opacity-90 group-hover:opacity-100"
          )}
        >
          Chat with Briq
        </span>
      </Button>
    ),
    []
  );

  if (!isOpen) {
    return ChatToggle;
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "fixed z-50 transition-all duration-500 ease-out",
          isFullscreen
            ? "inset-0"
            : "bottom-6 right-6 w-[95vw] sm:w-[450px] h-[85vh] sm:h-[650px]"
        )}
      >
        {isAllNotesLoading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        ) : (
          <article
            ref={chatContainerRef}
            className={cn(
              "flex flex-col w-full h-full",
              "bg-background/90 backdrop-blur-md border border-border/30",
              isFullscreen ? "rounded-none" : "rounded-3xl",
              "transition-all duration-500 ease-out",
              "animate-in slide-in-from-bottom-3 zoom-in-95",
              "shadow-2xl hover:shadow-3xl",
              "motion-safe:animate-in motion-safe:fade-in-0",
              "overflow-clip",
              isFullscreen && "md:px-8 lg:px-16 xl:px-32 2xl:px-64"
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-header"
          >
            <ChatHeader
              chatContext={chatContext}
              clearChatContext={clearChatContext}
              setIsOpen={setIsOpen}
              isFullscreen={isFullscreen}
              toggleFullscreen={toggleFullscreen}
            />

            <div
              className={cn(
                "flex-1 flex flex-col overflow-hidden",
                !isFullscreen && "rounded-b-3xl",
                isFullscreen && "max-w-5xl mx-auto w-full"
              )}
            >
              {isAllNotesLoading ? (
                <div className="flex items-center justify-center flex-1">
                  <Spinner size="sm" />
                </div>
              ) : (
                <>
                  <ChatContent
                    scrollContainerRef={scrollContainerRef}
                    chatContext={chatContext}
                    setFollowUp={setFollowUp}
                    email={user?.email ?? ""}
                    displayedText={displayedText}
                    isLoading={isLoading}
                    isFullscreen={isFullscreen}
                  />

                  <InputArea
                    followUp={followUp}
                    setFollowUp={setFollowUp}
                    setQuery={setQuery}
                    maxLength={maxLength}
                    isFullscreen={isFullscreen}
                  />
                </>
              )}
            </div>
          </article>
        )}
      </div>
    </TooltipProvider>
  );
}

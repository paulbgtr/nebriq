"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/shared/lib/utils";
import { BrainCircuit } from "lucide-react";
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
      <div className="fixed bottom-6 right-6 z-50">
        <div
          onClick={() => setIsOpen(true)}
          className="relative cursor-pointer group"
          aria-label="Chat with Briq AI"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setIsOpen(true)}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/15 via-primary/10 to-primary/5 blur-sm group-hover:from-primary/25 group-hover:via-primary/15 group-hover:to-primary/10 transition-all duration-500 ease-in-out" />

          <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-primary/20 bg-background/70 backdrop-blur-sm shadow-sm group-hover:border-primary/30 group-hover:shadow-md transition-all duration-500 ease-in-out">
            <BrainCircuit
              className="w-5 h-5 sm:w-6 sm:h-6 text-primary/70 group-hover:text-primary transition-all duration-400 ease-in-out"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>
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
          "fixed z-50 transition-all duration-500 ease-in-out",
          isFullscreen
            ? "inset-0"
            : "bottom-6 right-6 w-[95vw] sm:w-[450px] h-[85vh] sm:h-[650px]"
        )}
      >
        <article
          ref={chatContainerRef}
          className={cn(
            "flex flex-col w-full h-full",
            "bg-background/90 backdrop-blur-md border border-border/30",
            isFullscreen ? "rounded-none" : "rounded-3xl",
            "transition-all duration-500 ease-in-out",
            "animate-in slide-in-from-bottom-3 zoom-in-95",
            "shadow-2xl hover:shadow-3xl",
            "motion-safe:animate-in motion-safe:fade-in-0",
            "overflow-clip"
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
              "flex-1 flex flex-col overflow-hidden transition-all duration-500 ease-in-out",
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
      </div>
    </TooltipProvider>
  );
}

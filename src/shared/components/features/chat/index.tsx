"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { Box } from "lucide-react";
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
    relevantNotes
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
        className="fixed bottom-5 right-5 h-12 w-12 rounded-full shadow-lg 
          hover:shadow-xl transition-shadow duration-200
          md:h-14 md:w-14"
      >
        <Box className="h-5 w-5 md:h-6 md:w-6" />
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
          isFullscreen ? "inset-0" : "bottom-6 right-6 w-[95vw] sm:w-[450px]"
        )}
      >
        {isAllNotesLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : (
          <article
            ref={chatContainerRef}
            className={cn(
              "flex flex-col",
              "bg-background/90 backdrop-blur-md",
              "border border-border/30",
              "transition-all duration-500 ease-out",
              "animate-in slide-in-from-bottom-3 zoom-in-95",
              isFullscreen
                ? "fixed inset-0 w-full h-full"
                : "h-[85vh] sm:h-[650px] rounded-3xl shadow-2xl hover:shadow-3xl",
              "motion-safe:animate-in motion-safe:fade-in-0"
            )}
          >
            <ChatHeader
              chatContext={chatContext}
              clearChatContext={clearChatContext}
              setIsOpen={setIsOpen}
              isFullscreen={isFullscreen}
              toggleFullscreen={toggleFullscreen}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
              {isAllNotesLoading ? (
                <div className="flex-1 flex justify-center items-center">
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
                  />

                  <InputArea
                    followUp={followUp}
                    setFollowUp={setFollowUp}
                    setQuery={setQuery}
                    maxLength={maxLength}
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

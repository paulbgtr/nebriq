"use client";

import { useState, useRef, useEffect } from "react";
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

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { getNotesQuery } = useNotes();
  const { relevantNotes, setRelevantNotes } = useRelevantNotesStore();

  const { data: allNotes, isLoading: isAllNotesLoading } = getNotesQuery;

  useEffect(() => {
    setRelevantNotes(allNotes ?? []);
  }, [allNotes]);

  const { user } = useUser();
  const { setQuery, chatContext, isLoading, clearChatContext } = useChat(
    user?.id,
    relevantNotes
  );

  const maxLength = 100;

  const lastAssistantMessage = chatContext.conversationHistory
    .filter((msg) => msg.role === "assistant")
    .slice(-1)[0]?.content;

  const { displayedText } = useTypewriter(lastAssistantMessage ?? "", 15);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [chatContext.conversationHistory]);

  const ChatToggle = () => (
    <Button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-5 right-5 h-12 w-12 rounded-full shadow-lg"
    >
      <Box className="h-5 w-5" />
    </Button>
  );

  if (!isOpen) {
    return <ChatToggle />;
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-5 right-5 w-[400px] z-50">
        {!isOpen ? (
          <Button
            onClick={() => setIsOpen(true)}
            className={cn(
              "fixed bottom-5 right-5 h-14 w-14 rounded-full",
              "bg-primary/90 hover:bg-primary",
              "shadow-lg hover:shadow-xl",
              "transform transition-all duration-300",
              "hover:scale-105",
              "flex items-center justify-center"
            )}
          >
            <Box className="h-6 w-6 text-primary-foreground" />
          </Button>
        ) : (
          <>
            {isAllNotesLoading ? (
              <Spinner />
            ) : (
              <article
                ref={chatContainerRef}
                className={cn(
                  "flex flex-col h-[600px] rounded-3xl",
                  "bg-background/95 backdrop-blur-sm",
                  "border border-border/50",
                  "shadow-2xl hover:shadow-3xl",
                  "transition-all duration-500 ease-out",
                  "animate-in slide-in-from-bottom-3 zoom-in-95"
                )}
              >
                <ChatHeader
                  chatContext={chatContext}
                  clearChatContext={clearChatContext}
                  setIsOpen={setIsOpen}
                />

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
              </article>
            )}
          </>
        )}
      </div>
    </TooltipProvider>
  );
}

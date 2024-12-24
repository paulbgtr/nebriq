"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { FaArrowUp } from "react-icons/fa";
import {
  Bot,
  Sparkles,
  Trash2,
  Lightbulb,
  MessageSquare,
  X,
  Copy,
} from "lucide-react";
import { useFollowUp } from "@/hooks/use-follow-up";
import { useTypewriter } from "@/hooks/use-typewriter";
import { useUser } from "@/hooks/use-user";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";
import ReactMarkdown from "react-markdown";
import { useRelevantNotesStore } from "@/store/relevant-notes";
import { useNotes } from "@/hooks/use-notes";

const QUERY_EXAMPLES = [
  "Summarize my recent notes",
  "Find notes about projects",
  "What did I write about yesterday?",
  "Show me notes with tasks",
];

export default function AIChat() {
  const [followUp, setFollowUp] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showExamples, setShowExamples] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { getNotesQuery } = useNotes();
  const { relevantNotes, setRelevantNotes } = useRelevantNotesStore();

  const { data: allNotes } = getNotesQuery;

  useEffect(() => {
    setRelevantNotes(allNotes ?? []);
  }, [allNotes]);

  const { user } = useUser();
  const { setQuery, followUpContext, isLoading, clearFollowUpContext } =
    useFollowUp(user?.id, relevantNotes);

  const maxLength = 100;

  const lastAssistantMessage = followUpContext.conversationHistory
    .filter((msg) => msg.role === "assistant")
    .slice(-1)[0]?.content;

  const { displayedText } = useTypewriter(lastAssistantMessage ?? "", 15);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [followUpContext.conversationHistory]);

  useEffect(() => {
    if (followUpContext.conversationHistory.length > 0) {
      setShowExamples(false);
    }
  }, [followUpContext.conversationHistory]);

  const handleExampleClick = (example: string) => {
    setFollowUp(example);
  };

  const QueryExamples = () => {
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            Try asking:
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {QUERY_EXAMPLES.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className={cn(
                "text-sm px-3 py-2 rounded-lg text-left transition-all duration-200",
                "bg-secondary/40 hover:bg-secondary/60",
                "text-secondary-foreground hover:text-foreground",
                "border border-transparent hover:border-primary/20"
              )}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const ClearChat = () => {
    return (
      <div className="flex justify-between items-center p-3 border-b">
        <h3 className="font-semibold">AI Assistant</h3>
        <div className="flex gap-2">
          <Button
            onClick={clearFollowUpContext}
            variant="ghost"
            size="sm"
            className={cn(
              "group flex items-center gap-2 px-3 py-1.5",
              "text-muted-foreground hover:text-destructive",
              "transition-all duration-300 ease-in-out",
              "rounded-full hover:bg-destructive/10",
              "border border-transparent hover:border-destructive/20",
              followUpContext.conversationHistory.length === 0 &&
                "opacity-50 pointer-events-none"
            )}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  const ChatToggle = () => (
    <Button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-5 right-5 h-12 w-12 rounded-full shadow-lg"
    >
      <MessageSquare className="h-5 w-5" />
    </Button>
  );

  const LoadingIndicator = () => (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce delay-150" />
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce delay-300" />
      </div>
    </div>
  );

  const MessageActions = ({ message }: { message: any }) => (
    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 bg-white"
            onClick={() => navigator.clipboard.writeText(message.content)}
          >
            <Copy className="w-3 h-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy message</TooltipContent>
      </Tooltip>
    </div>
  );

  if (!isOpen) {
    return <ChatToggle />;
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-5 right-5 w-[400px] z-50">
        <article
          ref={chatContainerRef}
          className={cn(
            "flex flex-col h-[600px] rounded-2xl shadow-lg border bg-background overflow-hidden",
            "transition-all duration-300 ease-in-out",
            "animate-in slide-in-from-bottom-3",
            "hover:shadow-xl"
          )}
        >
          <ClearChat />
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto space-y-6"
          >
            <div className="py-2 px-6">
              {!followUpContext.conversationHistory.length ? (
                <QueryExamples />
              ) : (
                <div className="space-y-6">
                  {followUpContext.conversationHistory.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start gap-3",
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      )}
                    >
                      <div
                        className={cn(
                          "flex-shrink-0 rounded-full p-1.5",
                          message.role === "user"
                            ? "bg-primary/10"
                            : "bg-secondary/10"
                        )}
                      >
                        {message.role === "user" ? (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-foreground uppercase">
                              {user?.email?.[0] ?? "?"}
                            </span>
                          </div>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Bot className="w-4 h-4 text-secondary-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>AI Assistant powered by GPT-4</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <div
                        className={cn(
                          "relative flex-1 px-4 py-3 rounded-2xl text-sm group",
                          message.role === "user"
                            ? "bg-primary/10 text-foreground rounded-tr-sm"
                            : "bg-secondary/10 text-secondary-foreground rounded-tl-sm"
                        )}
                      >
                        <MessageActions message={message} />{" "}
                        <ReactMarkdown>
                          {message.role === "assistant" &&
                          message ===
                            followUpContext.conversationHistory
                              .filter((msg) => msg.role === "assistant")
                              .slice(-1)[0]
                            ? displayedText
                            : message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isLoading && <LoadingIndicator />}
                </div>
              )}
            </div>
          </div>
          <div className="p-4 bg-background/80 backdrop-blur-sm border-t">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (followUp.trim()) {
                  setQuery(followUp);
                  setFollowUp("");
                }
              }}
              className="relative"
            >
              <div className="relative group transition-all duration-500 ease-in-out">
                <div className="relative flex items-center">
                  <div className="absolute left-4 transition-all duration-300 transform text-muted-foreground group-hover:text-primary/70">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <Input
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    maxLength={maxLength}
                    type="text"
                    placeholder="Ask a question..."
                    className={cn(
                      "pl-11 pr-24 h-12",
                      "transition-all duration-300",
                      "border-muted hover:border-primary/50",
                      "focus:ring-2 focus:ring-primary/20",
                      "rounded-lg text-base",
                      "hover:shadow-md"
                    )}
                  />
                  <div className="absolute right-3 flex items-center space-x-2">
                    <span
                      className={cn(
                        "text-xs text-muted-foreground/60 transition-opacity duration-300",
                        followUp.length > 0 ? "opacity-100" : "opacity-0"
                      )}
                    >
                      {followUp.length}/{maxLength}
                    </span>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      disabled={followUp.length === 0}
                      className={cn(
                        "transition-all duration-200 rounded-full w-8 h-8 p-0",
                        "hover:bg-primary/20",
                        "focus-visible:ring-1 focus-visible:ring-primary",
                        followUp.length > 0 &&
                          "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      <FaArrowUp
                        className={cn(
                          "transition-all duration-300",
                          followUp.length === 0 && "opacity-50"
                        )}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </article>
      </div>
    </TooltipProvider>
  );
}

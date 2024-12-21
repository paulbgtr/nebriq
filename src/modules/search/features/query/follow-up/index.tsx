"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { FaArrowUp } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import { Bot } from "lucide-react";
import { useFollowUp } from "@/hooks/use-follow-up";
import { noteSchema } from "@/shared/lib/schemas/note";
import { z } from "zod";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useTypewriter } from "@/hooks/use-typewriter";
import { useUser } from "@/hooks/use-user";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";
import ReactMarkdown from "react-markdown";

export default function FollowUp({
  relevantNotes = [],
}: {
  relevantNotes: z.infer<typeof noteSchema>[];
}) {
  const [followUp, setFollowUp] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();
  const { setQuery, followUpContext, isLoading } = useFollowUp(
    user?.id,
    relevantNotes
  );

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

  return (
    <TooltipProvider>
      <div className="fixed bottom-5 left-0 right-0 max-w-xl mx-auto px-4">
        <article
          className={cn(
            "flex flex-col rounded-2xl shadow-lg border bg-background overflow-hidden transition-all duration-500 ease-in-out",
            isFocused ? "h-[450px]" : "h-[90px]"
          )}
        >
          {/* Messages container */}
          <div
            ref={scrollContainerRef}
            className={cn(
              "flex-1 overflow-y-auto p-6 transition-all duration-500 space-y-6",
              isFocused ? "opacity-100" : "opacity-0 h-0 p-0"
            )}
          >
            {!followUpContext.conversationHistory.length ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Sparkles className="text-gray-500 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  What would you like to talk about?
                </h3>
                <p className="text-sm text-gray-600">
                  Ask me anything about your notes or interests.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {followUpContext.conversationHistory.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3",
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
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
                            <Bot className="text-secondary-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>AI Assistant powered by GPT-4</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <div
                      className={cn(
                        "relative flex-1 px-4 py-3 rounded-2xl text-sm",
                        message.role === "user"
                          ? "bg-primary/10 text-foreground"
                          : "bg-secondary/10 text-secondary-foreground",
                        message.role === "user"
                          ? "rounded-tr-sm"
                          : "rounded-tl-sm"
                      )}
                    >
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
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 rounded-full p-1.5 bg-secondary/10">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Bot className="w-4 h-4 text-secondary-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>AI Assistant powered by GPT-4</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input form */}
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
              <div
                className={cn(
                  "relative group transition-all duration-500 ease-in-out",
                  isFocused && "ring-2 ring-primary/30 rounded-lg shadow-lg"
                )}
              >
                <div className="relative flex items-center">
                  <div
                    className={cn(
                      "absolute left-4 transition-all duration-300 transform",
                      isFocused
                        ? "text-primary scale-110 rotate-12"
                        : "text-muted-foreground",
                      "group-hover:text-primary/70 group-hover:scale-105"
                    )}
                  >
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <Input
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    maxLength={maxLength}
                    isBordered={false}
                    type="text"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                      if (!followUp.trim()) {
                        setIsFocused(false);
                      }
                    }}
                    placeholder="Ask follow-up question..."
                    className={cn(
                      "pl-11 pr-24 h-12 transition-all duration-300 ease-in-out",
                      "border-muted hover:border-primary/50",
                      isFocused &&
                        "ring-2 ring-primary/20 border-primary shadow-inner bg-background/80",
                      "placeholder:text-muted-foreground/60",
                      "text-base",
                      "hover:shadow-md",
                      "rounded-lg"
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

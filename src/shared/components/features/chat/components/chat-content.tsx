import { ChatContext } from "@/types/chat";
import { Box, MessageCircle, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/shared/lib/utils";
import { QueryExamples } from "./query-examples";
import { MessageActions } from "./message-actions";
import { LoadingIndicator } from "./loading-indicator";

type ChatContentProps = {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  chatContext: ChatContext;
  setFollowUp: (followUp: string) => void;
  email?: string;
  displayedText: string;
  isLoading: boolean;
  isFullscreen?: boolean;
};

type MessageProps = {
  message: ChatContext["conversationHistory"][0];
};

export const ChatContent = ({
  scrollContainerRef,
  chatContext,
  setFollowUp,
  email,
  displayedText,
  isLoading,
  isFullscreen = false,
}: ChatContentProps) => (
  <div
    ref={scrollContainerRef}
    className={cn("flex-1 overflow-y-auto", isFullscreen ? "p-8" : "p-6")}
  >
    {!chatContext.conversationHistory.length ? (
      <QueryExamples setFollowUp={setFollowUp} />
    ) : (
      <div className="space-y-6">
        {chatContext.conversationHistory.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-4 group",
              "animate-in slide-in-from-bottom-2",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <Avatar
              message={message}
              email={email}
              isFullscreen={isFullscreen}
            />
            <MessageBubble
              message={message}
              displayedText={displayedText}
              chatContext={chatContext}
              isFullscreen={isFullscreen}
            />
          </div>
        ))}
        {isLoading && <LoadingIndicator />}
      </div>
    )}
  </div>
);

// Updated Avatar Component
const Avatar = ({
  message,
  email,
  isFullscreen = false,
}: MessageProps & { email?: string; isFullscreen?: boolean }) => (
  <div
    className={cn(
      "flex-shrink-0 rounded-full",
      "flex items-center justify-center relative",
      "transition-all duration-300",
      "group-hover:shadow-sm",
      isFullscreen ? "w-12 h-12" : "w-10 h-10",
      message.role === "user"
        ? "bg-primary/10 border border-primary/20"
        : "bg-secondary/10 border border-secondary/20"
    )}
  >
    {message.role === "user" ? (
      <span
        className={cn(
          "font-semibold text-primary-foreground",
          isFullscreen ? "text-lg" : "text-base"
        )}
      >
        {email?.[0].toUpperCase() ?? "?"}
      </span>
    ) : (
      <div className="relative">
        <MessageCircle
          className={cn(
            "text-secondary-foreground",
            isFullscreen ? "w-7 h-7" : "w-6 h-6"
          )}
        />
        <Sparkles
          className={cn(
            "absolute text-yellow-300/80",
            "opacity-70",
            isFullscreen
              ? "w-2.5 h-2.5 -top-1 -right-1"
              : "w-2 h-2 -top-0.5 -right-0.5"
          )}
        />
      </div>
    )}
  </div>
);

// Updated MessageBubble Component
const MessageBubble = ({
  message,
  displayedText,
  chatContext,
  isFullscreen = false,
}: MessageProps &
  Pick<ChatContentProps, "displayedText" | "chatContext" | "isFullscreen">) => (
  <div
    className={cn(
      "flex-1 text-sm rounded-2xl relative",
      "transition-all duration-300 ease-out",
      "border",
      message.role === "user"
        ? "bg-primary/5 border-primary/10 hover:bg-primary/10"
        : "bg-secondary/5 border-secondary/10 hover:bg-secondary/10",
      message.role === "user" ? "ml-8" : "mr-8",
      isFullscreen ? "px-5 py-3" : "px-4 py-2"
    )}
  >
    <MessageActions message={message} />
    <ReactMarkdown
      className={cn(
        "prose prose-sm max-w-none",
        "prose-p:leading-relaxed prose-p:my-1",
        "prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md",
        isFullscreen && "prose-sm md:prose"
      )}
      components={{
        p: ({ children }) => <p className="text-foreground/90">{children}</p>,
        code: ({ children }) => (
          <code className="bg-muted/50 px-1.5 py-0.5 rounded-md">
            {children}
          </code>
        ),
      }}
    >
      {message.role === "assistant" &&
      message ===
        chatContext.conversationHistory
          .filter((m) => m.role === "assistant")
          .slice(-1)[0]
        ? displayedText
        : message.content}
    </ReactMarkdown>
  </div>
);

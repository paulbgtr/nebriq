import { ChatContext } from "@/types/chat";
import { Box } from "lucide-react";
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
};

type MessageProps = {
  message: ChatContext["conversationHistory"][0];
};

const Avatar = ({ message, email }: MessageProps & { email?: string }) => (
  <div
    className={cn(
      "flex-shrink-0 w-10 h-10 rounded-full",
      "flex items-center justify-center relative",
      "transition-all duration-300 group-hover:scale-110",
      message.role === "user"
        ? "bg-primary/10 shadow-primary/10"
        : "bg-secondary/10 shadow-secondary/10"
    )}
  >
    {message.role === "user" ? (
      <span className="text-base font-semibold text-primary-foreground">
        {email?.[0].toUpperCase() ?? "?"}
      </span>
    ) : (
      <Box className="w-6 h-6 text-secondary-foreground" />
    )}
  </div>
);

const MessageBubble = ({
  message,
  displayedText,
  chatContext,
}: MessageProps & Pick<ChatContentProps, "displayedText" | "chatContext">) => (
  <div
    className={cn(
      "flex-1 px-2 text-sm rounded-lg relative",
      "transition-all duration-200",
      message.role === "user"
        ? "bg-primary/10 ml-8 border-primary/20"
        : "bg-muted mr-8 border-border"
    )}
  >
    <MessageActions message={message} />
    <ReactMarkdown
      className={cn("prose prose-sm max-w-none")}
      components={{
        p: ({ children }) => <p className="text-foreground">{children}</p>,
        code: ({ children }) => (
          <code className="bg-muted px-1 py-0.5 rounded">{children}</code>
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

export const ChatContent = ({
  scrollContainerRef,
  chatContext,
  setFollowUp,
  email,
  displayedText,
  isLoading,
}: ChatContentProps) => (
  <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4">
    {!chatContext.conversationHistory.length ? (
      <QueryExamples setFollowUp={setFollowUp} />
    ) : (
      <div className="space-y-6">
        {chatContext.conversationHistory.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-3 group",
              "animate-in slide-in-from-bottom-2",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <Avatar message={message} email={email} />
            <MessageBubble
              message={message}
              displayedText={displayedText}
              chatContext={chatContext}
            />
          </div>
        ))}
        {isLoading && <LoadingIndicator />}
      </div>
    )}
  </div>
);

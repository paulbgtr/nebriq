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

export const ChatContent = ({
  scrollContainerRef,
  chatContext,
  setFollowUp,
  email,
  displayedText,
  isLoading,
}: ChatContentProps) => (
  <div ref={scrollContainerRef} className="flex-1 p-6 overflow-y-auto">
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

// Updated Avatar Component
const Avatar = ({ message, email }: MessageProps & { email?: string }) => (
  <div
    className={cn(
      "flex-shrink-0 w-10 h-10 rounded-full",
      "flex items-center justify-center relative",
      "transition-all duration-300 group-hover:scale-110",
      message.role === "user"
        ? "bg-primary/10 border border-primary/20 hover:shadow-md"
        : "bg-secondary/10 border border-secondary/20 hover:shadow-md"
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

// Updated MessageBubble Component
const MessageBubble = ({
  message,
  displayedText,
  chatContext,
}: MessageProps & Pick<ChatContentProps, "displayedText" | "chatContext">) => (
  <div
    className={cn(
      "flex-1 px-2 text-sm rounded-3xl relative shadow-sm",
      "transition-all duration-300 ease-out",
      "hover:shadow-lg",
      message.role === "user"
        ? "bg-primary/10 ml-8 border border-primary/20 hover:bg-primary/15"
        : "bg-secondary/5 mr-8 border border-secondary/10 hover:bg-secondary/10"
    )}
  >
    <MessageActions message={message} />
    <ReactMarkdown
      className={cn(
        "prose prose-sm max-w-none",
        "prose-p:leading-relaxed prose-p:my-1",
        "prose-code:bg-muted/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md"
      )}
      components={{
        p: ({ children }) => <p className="text-foreground/90">{children}</p>,
        code: ({ children }) => (
          <code className="bg-muted/70 px-1.5 py-0.5 rounded-md">
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

import { ChatContext } from "@/types/chat";
import { QueryExamples } from "./query-examples";
import { cn } from "@/shared/lib/utils";
import { Box } from "lucide-react";
import { MessageActions } from "./message-actions";
import ReactMarkdown from "react-markdown";
import { LoadingIndicator } from "./loading-indicator";

type Props = {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  chatContext: ChatContext;
  setFollowUp: (followUp: string) => void;
  email?: string;
  displayedText: string;
  isLoading: boolean;
};

export const ChatContent = ({
  scrollContainerRef,
  chatContext,
  setFollowUp,
  email,
  displayedText,
  isLoading,
}: Props) => {
  type ChildProps = {
    message: ChatContext["conversationHistory"][0];
  };

  const Avatar = ({ message }: ChildProps) => {
    return (
      <div
        className={cn(
          "flex-shrink-0 relative",
          "w-10 h-10",
          "rounded-full",
          "flex items-center justify-center",

          "before:content-['']",
          "before:absolute before:inset-0",
          "before:rounded-full",
          "before:p-[2px]",
          "before:bg-gradient-to-r",

          message.role === "user"
            ? [
                "bg-primary/10",
                "before:from-primary/20 before:to-primary/40",
                "shadow-sm shadow-primary/10",
              ]
            : [
                "bg-secondary/10",
                "before:from-secondary/20 before:to-secondary/40",
                "shadow-sm shadow-secondary/10",
              ],

          "transform transition-all duration-300 ease-in-out",
          "group-hover:scale-110",
          "cursor-pointer",

          "group-hover:ring-2",
          "group-hover:ring-offset-2",
          "group-hover:ring-offset-background",
          message.role === "user"
            ? "group-hover:ring-primary/30"
            : "group-hover:ring-secondary/30"
        )}
      >
        {message.role === "user" ? (
          <div
            className={cn(
              "relative w-full h-full rounded-full",
              "flex items-center justify-center",
              "overflow-hidden",
              "bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5"
            )}
          >
            <span
              className={cn(
                "text-base font-semibold",
                "text-primary-foreground",
                "select-none",
                "transform transition-transform duration-300",
                "group-hover:scale-110"
              )}
            >
              {email?.[0].toUpperCase() ?? "?"}
            </span>
          </div>
        ) : (
          <div
            className={cn(
              "relative w-full h-full rounded-full",
              "flex items-center justify-center",
              "bg-gradient-to-br from-secondary/20 via-secondary/10 to-secondary/5"
            )}
          >
            <Box
              className={cn(
                "w-6 h-6",
                "text-secondary-foreground",
                "transform transition-transform duration-300",
                "group-hover:scale-110"
              )}
            />
          </div>
        )}
      </div>
    );
  };

  const MessageBubble = ({ message }: ChildProps) => {
    return (
      <div
        className={cn(
          "relative flex-1 px-1 text-sm",
          "transform transition-all duration-200 ease-in-out",

          "rounded-[20px]",

          "hover:scale-[1.01]",
          "group-hover:shadow-lg group-hover:shadow-black/5",

          message.role === "user"
            ? [
                "bg-primary/15 text-foreground",
                "rounded-tr-sm",
                "ml-8 mr-2",
                "border border-primary/10",
                "dark:bg-primary/10",
              ]
            : [
                "bg-secondary/15 text-secondary-foreground",
                "rounded-tl-sm",
                "mr-8 ml-2",
                "border border-secondary/10",
                "dark:bg-secondary/10",
              ],

          "backdrop-blur-sm",

          "leading-relaxed tracking-wide"
        )}
      >
        <MessageActions message={message} />

        <ReactMarkdown
          className={cn(
            "prose prose-sm max-w-none",
            "prose-headings:font-semibold prose-headings:leading-tight",
            "prose-p:my-2 prose-p:leading-relaxed",
            "prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:bg-muted",
            "prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg"
          )}
        >
          {message.role === "assistant" &&
          message ===
            chatContext.conversationHistory
              .filter((msg) => msg.role === "assistant")
              .slice(-1)[0]
            ? displayedText
            : message.content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto scroll-smooth px-6 py-4"
    >
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
              <Avatar message={message} />

              <MessageBubble message={message} />
            </div>
          ))}
          {isLoading && <LoadingIndicator />}
        </div>
      )}
    </div>
  );
};

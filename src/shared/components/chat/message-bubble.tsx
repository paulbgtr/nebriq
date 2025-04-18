import { cn } from "@/shared/lib/utils";

type MessageRole = "user" | "assistant";

interface MessageBubbleProps {
  role: MessageRole;
  content: string;
  className?: string;
}

export const MessageBubble = ({
  role,
  content,
  className,
}: MessageBubbleProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex mb-4",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      <div
        className={cn(
          "py-2 px-4 rounded-full",
          "text-sm leading-relaxed",
          isUser ? "bg-muted/40 rounded-2xl rounded-tr-sm" : "bg-transparent"
        )}
      >
        {content}
      </div>
    </div>
  );
};

import { Copy, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { ChatContext } from "@/types/chat";
import { useState, useEffect } from "react";

type Props = {
  message: ChatContext["conversationHistory"][0];
};

/**
 * A component that renders a message action bar with a single copy button.
 *
 * When the copy button is clicked, the component will attempt to copy the
 * message content to the user's clipboard and show a visual tick icon
 * to indicate success.
 *
 * @param message - The message object to copy
 * @returns A JSX element representing the message action bar
 */
export const MessageActions = ({ message }: Props) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center mt-1 transition-opacity duration-200",
        message.role === "assistant"
          ? "justify-start opacity-100 ml-0.5"
          : "justify-end opacity-0 group-hover:opacity-100 mr-1"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-5 w-5 rounded-full bg-muted/30 hover:bg-muted/50",
          "border-none shadow-none",
          copied && "bg-green-500/20 text-green-500/80"
        )}
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-2.5 w-2.5 transition-all duration-200" />
        ) : (
          <Copy className="h-2.5 w-2.5 text-muted-foreground/50" />
        )}
        <span className="sr-only">{copied ? "Copied" : "Copy message"}</span>
      </Button>
    </div>
  );
};

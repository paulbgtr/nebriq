import { Copy } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

/**
 * A component that renders a message action bar with a single copy button.
 *
 * When the copy button is clicked, the component will attempt to copy the
 * message content to the user's clipboard. If the copy operation is successful,
 * the component will display a toast notification with a success message. If
 * the copy operation fails, the component will display a toast notification
 * with an error message.
 *
 * @param message - The message object to copy
 * @returns A JSX element representing the message action bar
 */
export const MessageActions = ({ message }: { message: any }) => {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast({
        title: "Message copied to clipboard",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Failed to copy message",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-7 w-7",
          "bg-background/80 backdrop-blur-sm",
          "hover:bg-background/90",
          "border border-border/50",
          "shadow-sm",
          "transition-all duration-200"
        )}
        onClick={copyToClipboard}
      >
        <Copy className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
};

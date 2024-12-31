import { X, Box, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ChatContext } from "@/types/chat";
import { cn } from "@/shared/lib/utils";

type Props = {
  chatContext: ChatContext;
  clearChatContext: () => void;
  setIsOpen: (isOpen: boolean) => void;
};

export const ChatHeader = ({
  chatContext,
  clearChatContext,
  setIsOpen,
}: Props) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center gap-2">
        <Box className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-foreground">
          Briq - Your AI Assistant
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={clearChatContext}
          variant="ghost"
          size="sm"
          className={cn(
            "group flex items-center gap-2 px-3 py-1.5",
            "text-muted-foreground hover:text-destructive",
            "transition-all duration-300 ease-in-out",
            "rounded-full hover:bg-destructive/10",
            "border border-transparent hover:border-destructive/20",
            chatContext.conversationHistory.length === 0 &&
              "opacity-50 pointer-events-none"
          )}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="rounded-full h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

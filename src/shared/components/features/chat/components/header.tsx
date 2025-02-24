import { X, Box, Trash2, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ChatContext } from "@/types/chat";
import { cn } from "@/shared/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/shared/components/ui/tooltip";

type Props = {
  chatContext: ChatContext;
  clearChatContext: () => void;
  setIsOpen: (isOpen: boolean) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
};

export const ChatHeader = ({
  chatContext,
  clearChatContext,
  setIsOpen,
  isFullscreen,
  toggleFullscreen,
}: Props) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
      <div className="flex items-center gap-2">
        <Box className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-md text-foreground">
          Briq - Your AI Assistant
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={clearChatContext}
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full h-8 w-8",
                "text-muted-foreground hover:text-destructive",
                "transition-all duration-300 ease-in-out",
                "hover:bg-destructive/10",
                chatContext.conversationHistory.length === 0 &&
                  "opacity-50 pointer-events-none"
              )}
              aria-label="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear chat history</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="w-8 h-8 rounded-full hover:bg-primary/10 hover:text-primary"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Close chat</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

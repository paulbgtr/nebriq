import {
  X,
  MessageCircle,
  Sparkles,
  Trash2,
  Maximize2,
  Minimize2,
} from "lucide-react";
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
    <div
      className={cn(
        "flex items-center justify-between border-b bg-background",
        isFullscreen ? "px-8 py-4 md:px-12 lg:px-16" : "px-4 py-3"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between w-full",
          isFullscreen && "max-w-5xl mx-auto"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <MessageCircle
              className={cn(
                "text-primary",
                isFullscreen ? "w-6 h-6" : "w-5 h-5"
              )}
            />
            <Sparkles
              className={cn(
                "absolute text-yellow-300/80 opacity-70",
                isFullscreen
                  ? "w-2.5 h-2.5 -top-1 -right-1"
                  : "w-2 h-2 -top-0.5 -right-0.5"
              )}
            />
          </div>
          <h2
            className={cn(
              "font-semibold text-foreground",
              isFullscreen ? "text-xl" : "text-md"
            )}
          >
            Briq - Your AI Assistant
          </h2>
        </div>

        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={clearChatContext}
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full",
                  isFullscreen ? "h-9 w-9" : "h-8 w-8",
                  "text-muted-foreground hover:text-destructive/80",
                  "transition-all duration-200 ease-out",
                  "hover:bg-destructive/5",
                  chatContext.conversationHistory.length === 0 &&
                    "opacity-50 pointer-events-none"
                )}
                aria-label="Clear chat history"
              >
                <Trash2 className={cn(isFullscreen ? "w-5 h-5" : "w-4 h-4")} />
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
                className={cn(
                  "rounded-full hover:bg-primary/5 hover:text-primary/80",
                  "transition-all duration-200 ease-out",
                  isFullscreen ? "h-9 w-9" : "h-8 w-8"
                )}
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
              >
                {isFullscreen ? (
                  <Minimize2
                    className={cn(isFullscreen ? "w-5 h-5" : "w-4 h-4")}
                  />
                ) : (
                  <Maximize2
                    className={cn(isFullscreen ? "w-5 h-5" : "w-4 h-4")}
                  />
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
                className={cn(
                  "rounded-full hover:bg-destructive/5 hover:text-destructive/80",
                  "transition-all duration-200 ease-out",
                  isFullscreen ? "h-9 w-9" : "h-8 w-8"
                )}
                aria-label="Close chat"
              >
                <X className={cn(isFullscreen ? "w-5 h-5" : "w-4 h-4")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close chat</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

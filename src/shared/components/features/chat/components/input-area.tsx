import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { FaArrowUp } from "react-icons/fa";
import { KeyboardEvent } from "react";
import { Textarea } from "@/shared/components/ui/textarea";

type Props = {
  followUp: string;
  setFollowUp: (followUp: string) => void;
  setQuery: (query: string) => void;
  maxLength: number;
  isFullscreen?: boolean;
};

export const InputArea = ({
  followUp,
  setFollowUp,
  setQuery,
  maxLength,
  isFullscreen = false,
}: Props) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (followUp.trim()) {
        setQuery(followUp);
        setFollowUp("");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (followUp.trim()) {
      setQuery(followUp);
      setFollowUp("");
    }
  };

  const CharCounter = () => {
    return (
      <span
        className={cn(
          "text-xs font-medium text-muted-foreground/50",
          followUp.length > maxLength * 0.8 && "text-yellow-500",
          followUp.length === maxLength && "text-red-500"
        )}
      >
        {followUp.length}/{maxLength}
      </span>
    );
  };

  const Submit = () => {
    return (
      <Button
        type="submit"
        disabled={followUp.length === 0}
        className={cn(
          "rounded-full w-8 h-8 p-0",
          "flex items-center justify-center",
          "transition-colors duration-200",
          followUp.length > 0
            ? "bg-primary text-primary-foreground hover:bg-primary/80"
            : "bg-transparent text-muted-foreground",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        <FaArrowUp className="w-4 h-4" />
      </Button>
    );
  };

  return (
    <div className={isFullscreen ? "px-8 py-6" : "px-6 py-4"}>
      <form
        onSubmit={handleSubmit}
        className={cn("relative", "mx-auto", isFullscreen && "max-w-2xl")}
      >
        <div className="relative">
          <Textarea
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={maxLength}
            placeholder="Message Briq..."
            rows={1}
            aria-label="Type your message"
            className={cn(
              "min-h-[48px] max-h-[200px] w-full py-3 px-4 pr-24",
              "text-base leading-relaxed resize-none",
              "rounded-xl border border-input",
              "bg-background",
              "focus:border-primary focus:ring-1 focus:ring-primary",
              "transition-all duration-300 ease-out",
              "placeholder:text-muted-foreground/40",
              "scrollbar-thin scrollbar-thumb-primary/20",
              "scrollbar-track-transparent",
              isFullscreen && "min-h-[56px] text-lg"
            )}
          />
          <div
            className={cn(
              "absolute flex items-center gap-2 right-3",
              isFullscreen ? "bottom-3" : "bottom-2"
            )}
          >
            <CharCounter />
            <Submit />
          </div>
        </div>
      </form>
    </div>
  );
};

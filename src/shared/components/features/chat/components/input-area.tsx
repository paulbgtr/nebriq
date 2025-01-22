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
};

export const InputArea = ({
  followUp,
  setFollowUp,
  setQuery,
  maxLength,
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

  const handleSubmit = async (e: React.FormEvent) => {
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
          "text-xs font-medium",
          "text-muted-foreground/60",
          "transition-all duration-200",
          followUp.length > 0 ? "opacity-100" : "opacity-0",
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
          // Base styles
          "rounded-xl w-10 h-10 p-0",
          "flex items-center justify-center",

          // Transitions
          "transition-all duration-200",

          // Active state
          followUp.length > 0
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl"
            : "bg-secondary/10 text-muted-foreground hover:bg-secondary/20",

          // Disabled state
          "disabled:opacity-40 disabled:cursor-not-allowed",

          // Hover effects
          "hover:scale-105 active:scale-95",

          // Dark mode
          "dark:disabled:opacity-30"
        )}
      >
        <FaArrowUp
          className={cn(
            "h-4 w-4",
            "transition-transform duration-200",
            followUp.length > 0 && "transform -translate-y-[1px]"
          )}
        />
      </Button>
    );
  };

  return (
    <div className="relative px-4 py-3 bg-background/95 backdrop-blur-md border-t">
      <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
        <div className="relative group">
          <div className="relative flex items-start">
            <Textarea
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={maxLength}
              placeholder="Message Briq"
              rows={1}
              className={cn(
                // Base styles
                "min-h-[52px] max-h-[200px] w-full py-3.5 px-4 pr-24",
                "text-base leading-relaxed resize-none",

                // Border and background
                "rounded-2xl border-[1.5px]",
                "bg-background/80 backdrop-blur-sm",
                "border-input/50 hover:border-primary/40",

                // Focus states
                "focus:border-primary focus:ring-2 focus:ring-primary/20",
                "focus:outline-none",

                // Transitions
                "transition-all duration-200 ease-in-out",

                // Placeholder
                "placeholder:text-muted-foreground/50",

                "scrollbar-thin scrollbar-thumb-primary/10",
                "scrollbar-track-transparent hover:scrollbar-thumb-primary/20",

                // Shadow effects
                "shadow-sm hover:shadow-md",

                // Dark mode adjustments
                "dark:bg-background/60 dark:hover:bg-background/70",
                "dark:border-input/30 dark:hover:border-primary/30"
              )}
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
              <CharCounter />

              <Submit />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

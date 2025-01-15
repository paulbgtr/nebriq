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

  return (
    <div className="p-4 bg-background/95 backdrop-blur-md border-t">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <div className="relative flex items-start">
            <Textarea
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={maxLength}
              placeholder="Ask a question... (Shift + Enter for new line)"
              rows={1}
              className={cn(
                "min-h-[48px] max-h-[200px] py-3 pr-24 text-base resize-none",
                "rounded-xl border-input/50",
                "bg-background/50 backdrop-blur-sm",
                "transition-all duration-300",
                "hover:border-primary/50 focus:border-primary",
                "focus:ring-2 focus:ring-primary/20",
                "placeholder:text-muted-foreground/60",
                "scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent",
                "hover:scrollbar-thumb-primary/20"
              )}
            />
            {/* Changed the positioning here */}
            <div className="absolute right-3 top-1.5 flex items-center gap-2">
              <span
                className={cn(
                  "text-xs text-muted-foreground/60",
                  "transition-opacity duration-300",
                  followUp.length > 0 ? "opacity-100" : "opacity-0"
                )}
              >
                {followUp.length}/{maxLength}
              </span>
              <Button
                type="submit"
                disabled={followUp.length === 0}
                className={cn(
                  "rounded-full w-9 h-9 p-0",
                  "transition-all duration-300",
                  "disabled:opacity-40",
                  followUp.length > 0
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary/10 text-muted-foreground hover:bg-secondary/20"
                )}
              >
                <FaArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

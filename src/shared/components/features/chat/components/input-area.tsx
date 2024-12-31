import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { FaArrowUp } from "react-icons/fa";

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
  return (
    <div className="p-4 bg-background/95 backdrop-blur-md border-t">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (followUp.trim()) {
            setQuery(followUp);
            setFollowUp("");
          }
        }}
        className="relative"
      >
        <div className="relative group">
          <div className="relative flex items-center">
            <Input
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              maxLength={maxLength}
              type="text"
              placeholder="Ask a question..."
              className={cn(
                "h-12 text-base",
                "rounded-xl border-input/50",
                "bg-background/50 backdrop-blur-sm",
                "transition-all duration-300",
                "hover:border-primary/50 focus:border-primary",
                "focus:ring-2 focus:ring-primary/20",
                "placeholder:text-muted-foreground/60"
              )}
            />
            <div className="absolute right-3 flex items-center gap-2">
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

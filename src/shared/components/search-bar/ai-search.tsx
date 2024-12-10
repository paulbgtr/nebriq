import { Switch } from "../ui/switch";
import { useSearchStore } from "@/store/search";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Label } from "../ui/label";

export const AISearch = () => {
  const { isAiSearch, setIsAiSearch } = useSearchStore();

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2 self-end relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "flex items-center space-x-2 cursor-pointer p-1.5 rounded-full transition-all duration-700",
                isAiSearch && "bg-primary/10"
              )}
            >
              <Switch
                id="ai-search"
                checked={isAiSearch}
                onCheckedChange={setIsAiSearch}
                className={cn(
                  "data-[state=checked]:bg-primary transition-all duration-700",
                  isAiSearch && "shadow-lg shadow-primary/20"
                )}
              />
              <Label
                htmlFor="ai-search"
                className={cn(
                  "flex items-center space-x-1 cursor-pointer select-none transition-all duration-700",
                  isAiSearch && "text-primary"
                )}
              >
                <Sparkles
                  className={cn(
                    "w-4 h-4 transition-all duration-700",
                    isAiSearch && "animate-pulse"
                  )}
                />
              </Label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-sm">
              Enable AI-powered semantic search for more accurate results and
              summary
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

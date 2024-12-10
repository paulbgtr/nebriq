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
      <div className="flex items-center space-x-2 self-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Switch
                id="ai-search"
                checked={isAiSearch}
                onCheckedChange={setIsAiSearch}
                className={cn("data-[state=checked]:bg-primary")}
              />
              <Label
                htmlFor="ai-search"
                className={cn(
                  "flex items-center space-x-1 cursor-pointer select-none"
                )}
              >
                <Sparkles className="w-4 h-4" />
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

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Button } from "@/shared/components/ui/button";
import { Copy } from "lucide-react";

export const MessageActions = ({ message }: { message: any }) => (
  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 bg-white"
          onClick={() => navigator.clipboard.writeText(message.content)}
        >
          <Copy className="w-3 h-3" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy message</TooltipContent>
    </Tooltip>
  </div>
);

"use client";

import { useState } from "react";
import { useSelectedModelStore } from "@/store/selected-model";
import { LLM_MODE_OPTIONS, LLMMode } from "@/types/chat";
import { cn } from "@/shared/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  MessageSquare,
  BarChart2,
  Brain,
  Lightbulb,
  Code,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

type ModeIconProps = {
  mode: LLMMode;
  className?: string;
};

const ModeIcon = ({ mode, className }: ModeIconProps) => {
  switch (mode) {
    case "analysis":
      return <BarChart2 className={className} />;
    case "reflection":
      return <Brain className={className} />;
    case "ideation":
      return <Lightbulb className={className} />;
    case "engineering":
      return <Code className={className} />;
    case "standard":
    default:
      return <MessageSquare className={className} />;
  }
};

export const ModeSelector = () => {
  const { selectedMode, setSelectedMode } = useSelectedModelStore();
  const [isOpen, setIsOpen] = useState(false);

  const selectedModeOption = LLM_MODE_OPTIONS.find(
    (option) => option.value === selectedMode
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-1 text-xs text-muted-foreground/70 hover:text-foreground",
                "transition-colors duration-200",
                "px-2.5 py-1.5 rounded-md",
                "hover:bg-muted/50 focus:bg-muted/50 focus:outline-none",
                "border border-transparent hover:border-border/30"
              )}
            >
              <span className="flex items-center gap-1.5">
                <ModeIcon
                  mode={selectedMode}
                  className={cn(
                    "w-4 h-4",
                    selectedModeOption?.color || "text-blue-500"
                  )}
                />
              </span>
              <ChevronDown className="w-3 h-3 ml-0.5 text-muted-foreground/50" />
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Reasoning mode</p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={5}
        className="w-72 p-2 rounded-lg shadow-md border border-border/30 bg-background/95 backdrop-blur-sm"
      >
        <div className="space-y-1">
          {LLM_MODE_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={cn(
                "w-full flex items-start gap-3 px-3 py-2.5 rounded-md text-left",
                "transition-colors duration-200",
                "focus:outline-none",
                selectedMode === option.value
                  ? "bg-muted/80 border-primary/20"
                  : "hover:bg-muted/50"
              )}
              onClick={() => {
                setSelectedMode(option.value);
                setIsOpen(false);
              }}
            >
              <div
                className={cn(
                  "relative w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  "bg-gradient-to-br from-background to-muted/80 border border-border/30",
                  "shadow-sm"
                )}
              >
                {selectedMode === option.value && (
                  <motion.div
                    layoutId="selectedMode"
                    className={cn(
                      "absolute inset-0 rounded-full border border-primary/30",
                      "bg-primary/10"
                    )}
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <ModeIcon
                  mode={option.value}
                  className={cn("w-4 h-4 relative z-10", option.color)}
                />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-medium">{option.label}</div>
                <div className="text-xs text-muted-foreground/80">
                  {option.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

"use client";

import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/shared/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Button } from "@/shared/components/ui/button";
import { useSelectedModelStore, models } from "@/store/selected-model";
import { motion, AnimatePresence } from "framer-motion";
import { AIModel } from "@/types/ai-model";

export const ModelSelector = () => {
  const { selectedModel, setSelectedModel } = useSelectedModelStore();

  const openSourceModels = models.filter((model) => model.isOpenSource);
  const otherModels = models.filter((model) => !model.isOpenSource);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-8 gap-1.5 px-2 text-xs font-medium",
            "hover:bg-muted/50",
            "text-muted-foreground/70 hover:text-muted-foreground",
            "transition-all duration-200"
          )}
        >
          <span>{selectedModel.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="top"
        className="w-56 p-1.5 backdrop-blur-xl bg-background/95"
      >
        {openSourceModels.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground/70 px-2 py-1.5">
              Open Source
            </DropdownMenuLabel>
            <AnimatePresence mode="wait">
              {openSourceModels.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ModelItem
                    model={model}
                    isSelected={selectedModel.id === model.id}
                    onSelect={() => {
                      if (model.available) {
                        setSelectedModel(model);
                      }
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {otherModels.length > 0 && <DropdownMenuSeparator />}
          </>
        )}

        <AnimatePresence mode="wait">
          {otherModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ delay: index * 0.05 }}
            >
              <ModelItem
                model={model}
                isSelected={selectedModel.id === model.id}
                onSelect={() => {
                  if (model.available) {
                    setSelectedModel(model);
                  }
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface ModelItemProps {
  model: AIModel;
  isSelected: boolean;
  onSelect: () => void;
}

const ModelItem = ({ model, isSelected, onSelect }: ModelItemProps) => {
  const item = (
    <DropdownMenuItem
      key={model.id}
      className={cn(
        "flex cursor-pointer items-center gap-2 px-2 py-1.5 rounded-md",
        "transition-all duration-200",
        !model.available && "opacity-70 cursor-not-allowed",
        isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50"
      )}
      disabled={!model.available}
      onClick={onSelect}
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={cn(
                "text-sm truncate",
                isSelected
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {model.name}
            </span>
          </div>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="shrink-0"
            >
              <Check className="h-3.5 w-3.5 text-primary" />
            </motion.div>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground/70">
          {model.description}
        </span>
      </div>
    </DropdownMenuItem>
  );

  if (!model.available) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{item}</TooltipTrigger>
        <TooltipContent
          side="left"
          className="bg-background/95 backdrop-blur-sm border border-border/30"
        >
          <div className="flex items-center gap-1.5 px-2 py-1">
            <span className="text-xs">Coming soon</span>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return item;
};

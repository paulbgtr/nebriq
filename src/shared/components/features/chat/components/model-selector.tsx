"use client";

import { Check, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Button } from "@/shared/components/ui/button";
import { useSelectedModelStore, models, AIModel } from "@/store/selected-model";

export const ModelSelector = () => {
  const { selectedModel, setSelectedModel } = useSelectedModelStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 border-dashed bg-background/50 px-2 text-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary/70" />
          <span>{selectedModel.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {models.map((model) => (
          <ModelItem
            key={model.id}
            model={model}
            isSelected={selectedModel.id === model.id}
            onSelect={() => {
              if (model.available) {
                setSelectedModel(model);
              }
            }}
          />
        ))}
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
        "flex cursor-pointer items-center justify-between py-2",
        !model.available && "opacity-70 cursor-not-allowed",
        isSelected && "bg-accent"
      )}
      disabled={!model.available}
      onClick={onSelect}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{model.name}</span>
          {isSelected && <Check className="h-4 w-4 text-primary" />}
        </div>
        <span className="text-xs text-muted-foreground">
          {model.description}
        </span>
      </div>
    </DropdownMenuItem>
  );

  if (!model.available) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{item}</TooltipTrigger>
        <TooltipContent side="left">
          <div className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Coming soon</span>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return item;
};

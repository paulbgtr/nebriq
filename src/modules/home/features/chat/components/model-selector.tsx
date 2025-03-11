"use client";

import { ChevronDown, Check } from "lucide-react";
import { OpenAI, Mistral, Gemini, Grok } from "@lobehub/icons";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Button } from "@/shared/components/ui/button";
import { useSelectedModelStore, models } from "@/store/selected-model";
import { AIModel } from "@/types/ai-model";
import { Badge } from "@/shared/components/ui/badge";

const MODEL_ICONS = {
  gpt: OpenAI,
  o3: OpenAI,
  mistral: Mistral,
  gemini: Gemini,
  grok: Grok,
};

export const ModelSelector = () => {
  const { selectedModel, setSelectedModel } = useSelectedModelStore();

  const modelsByCategory = models.reduce(
    (acc, model) => {
      const category = model.category || "Beginner";
      if (!acc[category]) acc[category] = [];
      acc[category].push(model);
      return acc;
    },
    {} as Record<string, AIModel[]>
  );

  const getModelIcon = (model: AIModel, className = "h-3 w-3") => {
    const brandPrefix = Object.keys(MODEL_ICONS).find((prefix) =>
      model.id.startsWith(prefix)
    );

    if (brandPrefix) {
      const IconComponent =
        MODEL_ICONS[brandPrefix as keyof typeof MODEL_ICONS];
      return <IconComponent className={className} />;
    }

    return model.capabilities?.length ? (
      <span className="text-xs">{model.capabilities[0]}</span>
    ) : null;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs font-medium text-muted-foreground/80 hover:text-foreground transition-all duration-200 rounded-full hover:bg-muted/40"
        >
          {getModelIcon(selectedModel)}
          <span className="max-w-[80px] truncate">{selectedModel.name}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="top"
        className="w-56 p-1 backdrop-blur-xl bg-background/95"
      >
        {Object.entries(modelsByCategory).map(([category, categoryModels]) => (
          <div key={category} className="mb-1 last:mb-0">
            {/* Category header */}
            <div className="px-2 py-1 flex items-center justify-between">
              <div className="text-[10px] text-muted-foreground/70 flex items-center">
                {category}
              </div>
              <span className="text-[9px] text-muted-foreground/50">
                {category === "Beginner"
                  ? "Simple & Fast"
                  : category === "Advanced"
                    ? "Powerful & Smart"
                    : "For specific tasks"}
              </span>
            </div>

            <div className="space-y-0.5">
              {categoryModels.map((model) => (
                <Tooltip key={model.id}>
                  <TooltipTrigger asChild>
                    <DropdownMenuItem
                      className={cn(
                        "flex cursor-pointer items-center gap-1.5 px-2 py-1.5 rounded-md text-sm",
                        "transition-all duration-200",
                        !model.available && "opacity-70 cursor-not-allowed",
                        selectedModel.id === model.id
                          ? "bg-primary/5 hover:bg-primary/10"
                          : "hover:bg-muted/50"
                      )}
                      disabled={!model.available}
                      onClick={() => model.available && setSelectedModel(model)}
                    >
                      {/* Model icon and name */}
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        {getModelIcon(
                          model,
                          "h-3.5 w-3.5 text-primary/80 shrink-0"
                        )}
                        <span
                          className={cn(
                            "text-xs truncate",
                            selectedModel.id === model.id
                              ? "text-foreground font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {model.name}
                        </span>
                      </div>

                      {/* Badges and selected indicator */}
                      <div className="flex items-center gap-1 shrink-0">
                        {model.isOpenSource && (
                          <Badge
                            variant="outline"
                            className="px-1 py-0 h-4 text-[9px]"
                          >
                            OSS
                          </Badge>
                        )}
                        {selectedModel.id === model.id && (
                          <Check className="h-3 w-3 text-primary" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  </TooltipTrigger>

                  {/* Tooltip content */}
                  <TooltipContent
                    side="left"
                    className="bg-background/95 backdrop-blur-sm border border-border/30 max-w-[220px]"
                  >
                    <div className="flex flex-col gap-1 px-2 py-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">
                          {model.name}
                        </span>
                        {model.isOpenSource && (
                          <Badge
                            variant="outline"
                            className="px-1 py-0 h-4 text-[9px]"
                          >
                            Open Source
                          </Badge>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground/80">
                        {model.description}
                      </span>
                      {model.technicalDetails && (
                        <span className="text-[9px] text-muted-foreground/70">
                          {model.technicalDetails}
                        </span>
                      )}
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {model.capabilities?.map((capability) => (
                          <Badge
                            key={capability}
                            variant="secondary"
                            className="px-1 py-0 h-3.5 text-[8px]"
                          >
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {Object.keys(modelsByCategory).indexOf(category) <
              Object.keys(modelsByCategory).length - 1 && (
              <DropdownMenuSeparator className="my-1" />
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

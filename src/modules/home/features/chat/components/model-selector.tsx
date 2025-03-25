"use client";

import { Info, ChevronDown, Check, Lock, Gauge } from "lucide-react";
import {
  OpenAI,
  Mistral,
  Gemini,
  Grok,
  Meta,
  DeepSeek,
  Claude,
} from "@lobehub/icons";
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
import { Switch } from "@/shared/components/ui/switch";
import { useSelectedModelStore } from "@/store/selected-model";
import { AIModel } from "@/types/ai-model";
import { Badge } from "@/shared/components/ui/badge";
import { models } from "@/shared/data/models";
import { useSubscription } from "@/shared/hooks/use-subscription";
import Link from "next/link";

const MODEL_ICONS = {
  gpt: OpenAI,
  o3: OpenAI,
  mistral: Mistral,
  gemini: Gemini,
  grok: Grok,
  meta: Meta,
  deepseek: DeepSeek,
  claude: Claude,
};

export const ModelSelector = () => {
  const { selectedModel, setSelectedModel, isAutoMode, setAutoMode } =
    useSelectedModelStore();
  const { isPro } = useSubscription();

  const modelsByCategory = models.reduce(
    (acc, model) => {
      const category = model.category || "Beginner";
      if (!acc[category]) acc[category] = [];
      acc[category].push(model);
      return acc;
    },
    {} as Record<string, AIModel[]>
  );

  const beginnerModels = modelsByCategory["Beginner"] || [];
  const advancedModels = modelsByCategory["Advanced"] || [];
  const specializedModels = modelsByCategory["Specialized"] || [];

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
          {isAutoMode ? (
            <Gauge className="h-3 w-3 text-amber-500" />
          ) : (
            getModelIcon(selectedModel)
          )}
          <span className="max-w-[80px] truncate">
            {isAutoMode ? "Auto" : selectedModel.name}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="top"
        className="w-56 p-1 backdrop-blur-xl bg-background/95"
      >
        {isPro && (
          <>
            <div className="px-2 py-2 mb-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Gauge
                    className={cn(
                      "h-3.5 w-3.5 transition-colors duration-200",
                      isAutoMode ? "text-amber-500" : "text-muted-foreground/50"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs transition-colors duration-200",
                      isAutoMode
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    Auto-select model
                  </span>
                </div>
                <Switch
                  checked={isAutoMode}
                  onCheckedChange={setAutoMode}
                  className="data-[state=checked]:bg-amber-500"
                />
              </div>
              <p className="text-[9px] text-muted-foreground/70 mt-1">
                {isAutoMode
                  ? "AI will intelligently select the best model for your query"
                  : "Manually select your preferred AI model"}
              </p>
            </div>

            <DropdownMenuSeparator />
          </>
        )}

        <div
          className={cn(
            "transition-opacity duration-200",
            isAutoMode ? "opacity-60 pointer-events-none" : "opacity-100"
          )}
        >
          {/* Beginner Models */}
          <div className="px-2 py-1 flex items-center justify-between">
            <DropdownMenuLabel className="text-[10px] text-muted-foreground/70 p-0 flex items-center">
              Beginner
            </DropdownMenuLabel>
            <span className="text-[9px] text-muted-foreground/50">
              Simple & Fast
            </span>
          </div>
          <div className="space-y-0.5 mb-1">
            {beginnerModels.map((model) => (
              <ModelItem
                key={model.id}
                model={model}
                isSelected={selectedModel.id === model.id}
                onSelect={() => {
                  if (model.available) {
                    setSelectedModel(model);
                  }
                }}
                isLocked={false}
                getModelIcon={getModelIcon}
              />
            ))}
          </div>
          {advancedModels.length > 0 && (
            <DropdownMenuSeparator className="my-1" />
          )}

          {/* Advanced Models */}
          {advancedModels.length > 0 && (
            <>
              <div className="px-2 py-1 flex items-center justify-between">
                <DropdownMenuLabel className="text-[10px] text-muted-foreground/70 p-0 flex items-center">
                  Advanced
                  {!isPro && <Lock className="ml-1 h-3 w-3 text-amber-500" />}
                </DropdownMenuLabel>
                <span className="text-[9px] text-muted-foreground/50">
                  Powerful & Smart
                </span>
              </div>
              <div className="space-y-0.5 mb-1">
                {advancedModels.map((model) => (
                  <ModelItem
                    key={model.id}
                    model={model}
                    isSelected={selectedModel.id === model.id}
                    onSelect={() => {
                      if (model.available && isPro) {
                        setSelectedModel(model);
                      }
                    }}
                    isLocked={!isPro}
                    getModelIcon={getModelIcon}
                  />
                ))}
              </div>
              {specializedModels.length > 0 && (
                <DropdownMenuSeparator className="my-1" />
              )}
            </>
          )}

          {/* Specialized Models */}
          {specializedModels.length > 0 && (
            <>
              <div className="px-2 py-1 flex items-center justify-between">
                <DropdownMenuLabel className="text-[10px] text-muted-foreground/70 p-0 flex items-center">
                  Specialized
                  {!isPro && <Lock className="ml-1 h-3 w-3 text-amber-500" />}
                </DropdownMenuLabel>
                <span className="text-[9px] text-muted-foreground/50">
                  For specific tasks
                </span>
              </div>
              <div className="space-y-0.5 mb-1">
                {specializedModels.map((model) => (
                  <ModelItem
                    key={model.id}
                    model={model}
                    isSelected={selectedModel.id === model.id}
                    onSelect={() => {
                      if (model.available && isPro) {
                        setSelectedModel(model);
                      }
                    }}
                    isLocked={!isPro}
                    getModelIcon={getModelIcon}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {!isPro && (
          <div className="mt-2 p-2 bg-amber-500/10 rounded-md border border-amber-500/20">
            <div className="flex items-center gap-2 text-xs text-amber-600">
              <Lock className="h-3 w-3" />
              <span className="font-medium">Nebriq Pro Required</span>
            </div>
            <p className="text-[10px] mt-1 text-muted-foreground">
              Upgrade to Nebriq Pro to unlock advanced and specialized models.
            </p>
            <Button
              asChild
              variant="default"
              size="sm"
              className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Link href="/subscription">Upgrade Now</Link>
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface ModelItemProps {
  model: AIModel;
  isSelected: boolean;
  onSelect: () => void;
  isLocked: boolean;
  getModelIcon: (model: AIModel, className?: string) => React.ReactNode;
}

const ModelItem = ({
  model,
  isSelected,
  onSelect,
  isLocked,
  getModelIcon,
}: ModelItemProps) => {
  const item = (
    <DropdownMenuItem
      key={model.id}
      className={cn(
        "flex cursor-pointer items-center gap-1.5 px-2 py-1 rounded-md text-sm",
        "transition-all duration-200",
        (!model.available || isLocked) && "opacity-70 cursor-not-allowed",
        isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50"
      )}
      disabled={!model.available || isLocked}
      onClick={onSelect}
    >
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        {getModelIcon(
          model,
          cn(
            "h-3 w-3 shrink-0",
            isLocked ? "text-muted-foreground/50" : "text-primary/80"
          )
        )}
        <span
          className={cn(
            "text-xs truncate",
            isSelected ? "text-foreground font-medium" : "text-muted-foreground"
          )}
        >
          {model.name}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {model.isOpenSource && (
          <Badge variant="outline" className="px-1 py-0 h-4 text-[9px]">
            OSS
          </Badge>
        )}
        {isLocked && <Lock className="h-3 w-3 text-amber-500" />}
        {isSelected && <Check className="h-3 w-3 text-primary" />}
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-2.5 w-2.5 text-muted-foreground/40 ml-0.5 shrink-0" />
        </TooltipTrigger>
        <TooltipContent
          side="left"
          className="bg-background/95 backdrop-blur-sm border border-border/30 max-w-[220px]"
        >
          <div className="flex flex-col gap-1 px-2 py-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">{model.name}</span>
              {model.isOpenSource && (
                <Badge variant="outline" className="px-1 py-0 h-4 text-[9px]">
                  Open Source
                </Badge>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground/80">
              {model.description}
            </span>
            <span className="text-[9px] text-muted-foreground/70">
              {model.technicalDetails || "No technical details available"}
            </span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {model.capabilities && model.capabilities.length > 0 ? (
                model.capabilities.map((capability) => (
                  <Badge
                    key={capability}
                    variant="secondary"
                    className="px-1 py-0 h-3.5 text-[8px]"
                  >
                    {capability}
                  </Badge>
                ))
              ) : (
                <Badge
                  variant="secondary"
                  className="px-1 py-0 h-3.5 text-[8px]"
                >
                  Unknown
                </Badge>
              )}
            </div>
            {isLocked && (
              <div className="mt-1 pt-1 border-t border-border/20">
                <span className="text-[10px] text-amber-500 flex items-center gap-1">
                  <Lock className="h-2.5 w-2.5" />
                  Requires Nebriq Pro subscription
                </span>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
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

  if (isLocked) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{item}</TooltipTrigger>
        <TooltipContent
          side="left"
          className="bg-background/95 backdrop-blur-sm border border-border/30"
        >
          <div className="flex flex-col gap-1 px-2 py-1">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-amber-500" />
              <span className="text-xs font-medium">Pro Model</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Upgrade to Nebriq Pro to unlock this model.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return item;
};

import React from "react";
import { cn } from "../lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode | string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-6",
        "rounded-lg border border-dashed border-border/60",
        "bg-muted/30 min-h-[200px]",
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-4xl">
          {typeof icon === "string" ? icon : icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      )}
    </div>
  );
};

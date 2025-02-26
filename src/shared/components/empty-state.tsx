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
        "flex flex-col items-center justify-center text-center",
        "min-h-[180px] py-8",
        className
      )}
    >
      {icon && (
        <div className="mb-3 text-3xl text-muted-foreground/40">
          {typeof icon === "string" ? icon : icon}
        </div>
      )}
      <h3 className="text-base font-medium text-muted-foreground/70">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 text-sm text-muted-foreground/50 max-w-[280px]">
          {description}
        </p>
      )}
    </div>
  );
};

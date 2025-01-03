import * as React from "react";

import { cn } from "@/shared/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { isBordered?: boolean }
>(({ className, type, isBordered = true, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full h-9 px-3 rounded-md md:text-sm",
        "bg-background",
        "text-foreground",

        "placeholder:text-muted-foreground",
        "file:border-0 file:bg-transparent",
        "file:text-sm file:font-medium file:text-foreground",

        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring/30",
        isBordered && "focus-visible:border-ring",

        isBordered && ["border border-input", "hover:border-ring/50"],

        "disabled:cursor-not-allowed",
        "disabled:opacity-50",

        "transition-colors duration-200",

        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };

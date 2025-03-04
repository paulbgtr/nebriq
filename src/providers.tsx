"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./shared/lib/next-themes/theme-provider";
import queryClient from "./shared/lib/react-query";
import { TooltipProvider } from "./shared/components/ui/tooltip";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

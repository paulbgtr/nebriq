"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./shared/lib/next-themes/theme-provider";
import queryClient from "./shared/lib/react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

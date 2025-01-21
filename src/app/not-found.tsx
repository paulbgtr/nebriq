"use client";

import { buttonVariants } from "@/shared/components/ui/button";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { useUser } from "@/hooks/use-user";

export default function NotFound() {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-dot-pattern">
      <div className="text-center space-y-6 px-4 animate-fade-in">
        <div className="relative">
          <h1 className="text-[150px] font-extrabold text-primary/10 select-none animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <SearchX className="text-primary w-12 h-12" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl text-foreground font-bold">
            Oops! Page not found
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you&apos;re looking for seems to have wandered off.
            Let&apos;s get you back on track!
          </p>
        </div>
        <Link
          href={user ? "/home" : "/"}
          className={`${buttonVariants({
            variant: "default",
          })} mt-6 transform transition-transform hover:scale-105 hover:shadow-lg`}
        >
          ← Return Home
        </Link>
      </div>
    </div>
  );
}

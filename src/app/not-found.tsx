"use client";

import { buttonVariants } from "@/shared/components/ui/button";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { useUser } from "@/hooks/use-user";

export default function NotFound() {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex items-center justify-center bg-dot-pattern bg-gray-50">
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
          <h2 className="text-2xl font-bold text-gray-800">
            Oops! Page not found
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you're looking for seems to have wandered off. Let's get
            you back on track!
          </p>
        </div>
        <Link
          href={user ? "/search" : "/"}
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

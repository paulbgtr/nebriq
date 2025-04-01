"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Menu } from "lucide-react";
import { ModeToggle } from "@/modules/landing-page/features/theme-switcher";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface HeaderProps {
  motionConfig: {
    initial: { opacity: number; y: number };
    animate: { opacity: number; y: number };
    transition: { duration: number; ease: string };
  };
}

export const Header = ({ motionConfig }: HeaderProps) => {
  return (
    <motion.div
      {...motionConfig}
      className="fixed top-4 md:top-6 inset-x-0 z-50 px-4"
    >
      <div className="flex justify-center">
        <div
          className={cn(
            "relative w-full max-w-4xl flex items-center gap-4 px-4 sm:px-6 py-3 rounded-2xl border shadow-md",
            "bg-background/80 backdrop-blur-lg",
            "border-border/40 shadow-neutral-900/10 dark:shadow-black/15",
            "hover:shadow-neutral-900/15 dark:hover:shadow-black/20 transition-shadow duration-300"
          )}
        >
          {/* Glow effect (kept similar, maybe adjust opacity/blur if desired) */}
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.04, 0.12, 0.04] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-20 bg-primary/30 blur-[35px]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: 10, repeat: Infinity, delay: 2 }}
              className="absolute -right-10 top-1/2 -translate-y-1/2 w-40 h-20 bg-primary/30 blur-[35px]"
            />
          </div>

          {/* Logo with improved animation */}
          <div className="flex items-center gap-3 pr-4 sm:pr-5 border-r border-border/60">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 via-primary/20 to-primary/5"
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.6, 0.9, 0.6],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
                <div className="relative flex items-center justify-center w-full h-full rounded-full border border-primary/30 backdrop-blur-sm">
                  <Compass className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
              </div>
              <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground/80">
                Nebriq
              </span>
            </div>
          </div>

          {/* Redesigned Beta Badge */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/[0.08] border border-primary/15 shadow-sm shadow-primary/5">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary/60"></span>
                <span className="relative inline-flex w-2 h-2 rounded-full bg-primary"></span>
              </span>
              <span className="text-xs font-medium text-primary">BETA</span>
            </div>
          </div>

          {/* Center Nav Links */}
          <nav className="hidden sm:flex items-center gap-5 flex-grow justify-center px-4">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              Pricing
            </Link>
          </nav>

          {/* Right Section: Auth Links + Theme Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-muted-foreground hover:text-primary"
                )}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" })
                )}
              >
                Create Account
              </Link>
            </div>
            <ModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

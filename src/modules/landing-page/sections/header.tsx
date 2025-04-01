"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { ModeToggle } from "@/modules/landing-page/features/theme-switcher";
import { Button } from "@/shared/components/ui/button";

interface HeaderProps {
  motionConfig: {
    initial: { opacity: number; y: number };
    animate: { opacity: number; y: number };
    transition: { duration: number; ease: string };
  };
}

export const Header = ({ motionConfig }: HeaderProps) => {
  return (
    <motion.div {...motionConfig} className="fixed top-6 inset-x-0 z-50 px-4">
      <div className="max-w-7xl mx-auto flex justify-center">
        <div className="relative flex items-center gap-4 px-6 py-3 rounded-2xl border bg-background/95 backdrop-blur-xl border-primary/15 shadow-lg shadow-primary/10 hover:shadow-primary/15 transition-all duration-300">
          {/* Enhanced ambient glow effect */}
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -left-10 top-1/2 -translate-y-1/2 w-40 h-20 bg-primary/30 blur-[30px]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 10, repeat: Infinity, delay: 2 }}
              className="absolute -right-10 top-1/2 -translate-y-1/2 w-40 h-20 bg-primary/30 blur-[30px]"
            />
          </div>

          {/* Logo with improved animation */}
          <div className="flex items-center gap-3 pr-5 border-r border-border/60">
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
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/[0.1] border border-primary/15 shadow-sm shadow-primary/5">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary/60"></span>
                <span className="relative inline-flex w-2 h-2 rounded-full bg-primary"></span>
              </span>
              <span className="text-xs font-medium text-primary">BETA</span>
            </div>
          </div>

          {/* Improved Center Links */}
          <div className="hidden sm:flex items-center gap-8 px-6">
            <Link
              href="/signup"
              className="text-sm font-medium transition-all duration-300 text-muted-foreground hover:text-primary relative group"
            >
              <span>Create Account</span>
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-primary/80 to-primary/40 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <div className="w-px h-5 bg-border/60" />
            <Link
              href="/login"
              className="text-sm font-medium transition-all duration-300 text-muted-foreground hover:text-primary relative group"
            >
              <span>Sign in</span>
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-primary/80 to-primary/40 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          <div className="flex items-center">
            <div className="w-px h-5 bg-border/60 mr-5 hidden sm:block" />
            <div className="flex items-center justify-center">
              <ModeToggle />
            </div>
          </div>

          {/* Improved Mobile Menu */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="px-3 text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
              asChild
            >
              <Link href="/login">
                <span className="sr-only">Menu</span>
                Sign in
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

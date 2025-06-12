"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Compass, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  // Transform scroll position to opacity and blur values
  const headerOpacity = useTransform(scrollY, [0, 100], [0.9, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 100], [12, 20]);

  // Prevent hydration issues with scroll-based animations
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Track active section for navigation highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 },
    );

    const sections = ["problem", "features", "pricing"];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { href: "#problem", label: "Why Nebriq?" },
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
  ];

  return (
    <>
      <motion.div
        {...motionConfig}
        className="fixed top-4 md:top-6 inset-x-0 z-50 px-4"
        style={
          mounted
            ? {
                opacity: headerOpacity,
                backdropFilter: `blur(${headerBlur}px)`,
              }
            : {
                opacity: 0.9,
                backdropFilter: "blur(12px)",
              }
        }
      >
        <div className="flex justify-center">
          <motion.div
            className={cn(
              "relative w-full max-w-5xl flex justify-between items-center gap-4 px-4 sm:px-8 py-4",
              "bg-background/70 backdrop-blur-xl",
              "rounded-3xl border shadow-lg border-border/30",
              "shadow-neutral-900/5 dark:shadow-black/10",
              "ring-1 ring-white/10 dark:ring-white/5",
              "transition-all duration-500 ease-out",
            )}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Ambient glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />

            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 pr-4 sm:pr-6 relative z-10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link href="/" className="group">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10">
                    {/* Animated background rings */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/40 via-primary/20 to-transparent"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.8, 0.4],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute inset-1 rounded-full bg-gradient-to-br from-primary/30 to-transparent"
                      animate={{
                        scale: [1.1, 0.9, 1.1],
                        opacity: [0.3, 0.6, 0.3],
                        rotate: [360, 180, 0],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Logo container */}
                    <div className="relative flex items-center justify-center w-full h-full rounded-full border border-primary/40 backdrop-blur-sm bg-background/80 group-hover:border-primary/60 transition-colors duration-300">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Compass
                          className="w-5 h-5 text-primary group-hover:text-primary/90 transition-colors duration-300"
                          strokeWidth={1.5}
                        />
                      </motion.div>
                    </div>
                  </div>
                  <motion.span
                    className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground/90 group-hover:from-primary group-hover:to-primary/80 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    Nebriq
                  </motion.span>
                </div>
              </Link>
            </motion.div>

            {/* Center Nav Links */}
            <nav className="hidden lg:flex items-center gap-8 flex-grow justify-center px-6 relative z-10">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "relative text-sm font-medium transition-all duration-300 py-2 px-3 rounded-lg",
                      "hover:bg-primary/10 hover:text-primary",
                      activeSection === link.href.slice(1)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground",
                    )}
                    onClick={() => setActiveSection(link.href.slice(1))}
                  >
                    {link.label}
                    {activeSection === link.href.slice(1) && (
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-primary/5 border border-primary/20"
                        layoutId="activeNavItem"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Right Section: Auth Links + Theme Toggle */}
            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
              <div className="hidden sm:flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/login"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 rounded-xl",
                    )}
                  >
                    Sign in
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/signup"
                    className={cn(
                      buttonVariants({ variant: "default", size: "sm" }),
                      "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl",
                    )}
                  >
                    Create Account
                  </Link>
                </motion.div>
              </div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <ModeToggle />
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.div
                className="lg:hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle menu"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="relative rounded-xl hover:bg-primary/10"
                >
                  <motion.div
                    animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isMobileMenuOpen ? (
                      <X className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Menu className="h-5 w-5 text-muted-foreground" />
                    )}
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? "auto" : "none",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed inset-0 z-40 lg:hidden"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Content */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: isMobileMenuOpen ? 0 : -20,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="absolute top-28 left-4 right-4 bg-background/95 backdrop-blur-xl rounded-2xl border shadow-2xl p-6 max-h-[calc(100vh-6rem)] overflow-y-auto"
        >
          <nav className="flex flex-col gap-4 mb-6">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Link
                  href={link.href}
                  className="flex items-center text-base font-medium text-muted-foreground hover:text-primary transition-colors duration-200 py-3 px-4 rounded-xl hover:bg-primary/10"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveSection(link.href.slice(1));
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div
            className="flex flex-col gap-3 pt-4 border-t"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl",
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 rounded-xl",
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Create Account
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

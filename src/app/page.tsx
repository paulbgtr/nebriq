"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  Search,
  Twitter,
  Heart,
  Settings,
  Folders,
  FolderX,
  BookOpen,
  Mail,
  BotMessageSquare,
  Waypoints,
  Maximize,
  Cloud,
  Type,
  Sigma,
  Code,
  Tag,
  Compass,
} from "lucide-react";
import { ModeToggle } from "@/modules/landing-page/features/theme-switcher";
import { useTheme } from "next-themes";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/shared/components/ui/form";
import { useToast } from "@/shared/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/shared/lib/supabase/client";
import { sendEmail } from "./actions/emails/send-email";
import { Separator } from "@/shared/components/ui/separator";
import { extractFirstName } from "@/shared/lib/utils";
import { EmailTemplate } from "@/enums/email-template";
import { FuturisticCard } from "@/modules/landing-page/components/futuristic-card";
import { NeuralNetwork } from "@/modules/landing-page/features/neural-network";

const wishListSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email is too long")
    .trim()
    .toLowerCase(),
});

const imagePaths = {
  hero: {
    light: "/hero-image.png",
    dark: "/hero-image-dark.png",
  },
  intelligentSearch: {
    light: "/intelligent-search.png",
    dark: "/intelligent-search-dark.png",
  },
  graph: {
    light: "/graph.png",
    dark: "/graph-dark.png",
  },
  links: {
    light: "/links.png",
    dark: "/links-dark.png",
  },
  briq: {
    light: "/briq.png",
    dark: "/briq-dark.png",
  },
  editor: {
    light: "/editor.png",
    dark: "/editor-dark.png",
  },
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { theme, systemTheme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getImageUrl = (imageKey: keyof typeof imagePaths) => {
    if (!mounted) return imagePaths[imageKey].light;

    const currentTheme = theme === "system" ? systemTheme : theme;
    return currentTheme === "dark"
      ? imagePaths[imageKey].dark
      : imagePaths[imageKey].light;
  };

  const form = useForm<z.infer<typeof wishListSchema>>({
    resolver: zodResolver(wishListSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof wishListSchema>) => {
    setIsSubmitting(true);

    try {
      const client = createClient();

      const { email } = values;

      const { error } = await client.from("wishlist").insert({
        email,
      });

      if (error) {
        throw new Error(error.message);
      }

      await sendEmail(
        "You're on our wish list!",
        "waitlist@nebriq.com",
        email,
        EmailTemplate.WAITLIST,
        {
          firstName: extractFirstName(email),
        }
      );

      form.reset();

      toast({
        title: "Added to wish list",
        description: "You will receive updates soon.",
      });
    } catch (e) {
      const errorDescription = (e as Error).message.includes(
        "duplicate key value violates unique constraint"
      )
        ? "Your email is already on our wish list."
        : "Something went wrong. Please try again.";

      toast({
        variant: "destructive",
        title: "Adding to wish list failed",
        description: errorDescription,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToHero = () => {
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const motionConfig = {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {mounted && (
        <motion.div
          {...motionConfig}
          className="fixed top-4 sm:top-6 inset-x-0 z-50 px-2 sm:px-4"
        >
          <div className="max-w-7xl mx-auto flex justify-center">
            <div className="relative flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border bg-background/80 backdrop-blur-md border-primary/20 shadow-lg shadow-primary/5">
              {/* Logo */}
              <div className="flex items-center gap-2 sm:gap-3 pr-2 sm:pr-4 border-r border-border/60">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 via-primary/10 to-primary/5 blur-sm" />
                    <div className="relative flex items-center justify-center w-full h-full rounded-full border border-primary/20">
                      <Compass
                        className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <span className="text-base sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                    Nebriq
                  </span>
                </div>
              </div>

              {/* Beta Badge */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-primary/[0.08] border border-primary/10">
                  <span className="relative flex w-1.5 sm:w-2 h-1.5 sm:h-2">
                    <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary/40"></span>
                    <span className="relative inline-flex w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-[10px] sm:text-xs font-medium text-primary">
                    BETA
                  </span>
                </div>
              </div>

              {/* Center Links */}
              <div className="hidden sm:flex items-center gap-6 px-4">
                <Link
                  href="/signup"
                  className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                >
                  Create Account
                </Link>
                <div className="w-px h-4 bg-border/60" />
                <Link
                  href="/login"
                  className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                >
                  Sign in
                </Link>
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center">
                <div className="w-px h-4 bg-border/60 mr-4 hidden sm:block" />
                <ModeToggle />
              </div>

              {/* Mobile Menu (only shows login/signup) */}
              <div className="sm:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2 text-muted-foreground"
                  asChild
                >
                  <Link href="/login">
                    <span className="sr-only">Menu</span>
                    Sign in
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <NeuralNetwork />

          <div className="absolute inset-0 bg-gradient-radial from-background/70 via-background/50 to-transparent" />
        </div>

        {/* Hero Section */}
        <section
          id="hero"
          ref={heroRef}
          className="relative min-h-screen pt-24 sm:pt-32 pb-12 sm:pb-16 overflow-hidden"
        >
          {/* Floating Elements */}
          <div className="absolute inset-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute rounded-full top-1/4 -left-20 w-40 sm:w-60 h-40 sm:h-60 bg-primary/20 blur-[100px]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 7, repeat: Infinity, delay: 1 }}
              className="absolute rounded-full bottom-1/4 -right-20 w-60 sm:w-80 h-60 sm:h-80 bg-secondary/20 blur-[100px]"
            />
          </div>

          {/* Centered Text Content */}
          <div className="relative z-10 px-4 mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center space-y-4 sm:space-y-6"
            >
              {/* Hero Title */}
              <motion.div
                className="relative space-y-2 sm:space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.21, 0.45, 0.27, 0.99],
                }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                  <span className="block leading-[1.1] pb-1 sm:pb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80">
                    Start Writing.
                  </span>
                  <div className="relative mt-1 sm:mt-2">
                    <motion.span
                      className="absolute inset-0 bg-primary/20 blur-3xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />
                    <span className="block leading-[1.1] pb-1 sm:pb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80">
                      Stop Organizing.
                    </span>
                  </div>
                </h1>
                <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-muted-foreground">
                  A simple writing space that uses AI to keep your notes
                  organized.
                  <span className="hidden sm:inline">
                    {" "}
                    No folders, no tags, just write.
                  </span>
                </p>
              </motion.div>

              {/* CTA Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="max-w-xl mx-auto px-2 sm:px-0"
              >
                <div className="relative group">
                  <div className="absolute transition-all duration-500 rounded-lg -inset-1 bg-gradient-to-r from-primary/50 via-primary/30 to-primary/50 blur-lg group-hover:blur-xl" />
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="relative flex flex-col sm:flex-row gap-2 sm:gap-4 p-2 rounded-lg bg-background/80 backdrop-blur-sm"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="Enter your email"
                                className="h-10 sm:h-12 bg-transparent border-primary/20"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-10 sm:h-12 px-4 sm:px-8 transition-colors duration-300 bg-primary/90 hover:bg-primary"
                      >
                        Join Waitlist
                      </Button>
                    </form>
                  </Form>
                </div>
              </motion.div>

              {/* Feature Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2 sm:px-4"
              >
                {[
                  { icon: Sparkles, text: "AI-Powered" },
                  { icon: Search, text: "Smart Search" },
                  { icon: FolderX, text: "No Folders" },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 1 + index * 0.1,
                      ease: "easeOut",
                    }}
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-primary/20"
                  >
                    <feature.icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    <span className="text-xs sm:text-sm font-medium">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Full-Width Hero Image */}
          <div className="relative z-10 w-full mt-6 sm:mt-8 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="relative aspect-[16/9] rounded-lg sm:rounded-xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10"
            >
              {/* Enhanced glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 blur-2xl opacity-75" />

              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.015]" />

              <Image
                src={getImageUrl("hero")}
                alt="Nebriq Dashboard"
                fill
                className="object-cover rounded-lg sm:rounded-xl transition-transform duration-700 hover:scale-105"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
              />

              {/* Enhanced gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-primary/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-secondary/5 to-secondary/10" />

              {/* Shine effect */}
              <motion.div
                initial={{ opacity: 0, x: "-100%" }}
                animate={{ opacity: [0, 1, 0], x: ["100%", "100%", "300%"] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 5,
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
              />
            </motion.div>
          </div>
        </section>

        {/* Problem Statement Section */}
        <section
          id="problem"
          className="relative py-12 sm:py-16 md:py-24 mt-12 sm:mt-16 md:mt-32"
        >
          {/* Background elements */}
          <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />

          {/* Add floating gradient orbs similar to hero section */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute rounded-full top-1/3 -left-20 w-40 sm:w-60 h-40 sm:h-60 bg-primary/20 blur-[100px]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
              className="absolute rounded-full bottom-1/3 -right-20 w-60 sm:w-80 h-60 sm:h-80 bg-secondary/20 blur-[100px]"
            />
          </div>

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.015]" />

          {/* Rest of the content with relative positioning */}
          <div className="relative z-10 px-4 sm:px-6 mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 sm:mb-6 border rounded-full border-primary/20 bg-background/80 backdrop-blur-sm">
                  <Settings className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    The Problem
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold [text-wrap:balance] bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/80">
                  Note-Taking Has Become Too Complex
                </h2>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground/90 max-w-prose"
              >
                Most note-taking apps force you to spend time organizing instead
                of thinking. We believe you should focus on writing, while
                technology handles the organization.
              </motion.p>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12 text-left md:grid-cols-3">
                {[
                  {
                    title: "Too Many Features",
                    icon: Settings,
                    description:
                      "Endless settings, plugins, and customization options that distract from what matters - your ideas.",
                  },
                  {
                    title: "Complex Organization",
                    icon: Folders,
                    description:
                      "Rigid folder structures and tagging systems that require constant maintenance and reorganization.",
                  },
                  {
                    title: "Learning Curve",
                    icon: BookOpen,
                    description:
                      "Steep learning curves and complicated workflows that slow down your creative process.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="group"
                  >
                    <div className="p-4 sm:p-6 transition-all duration-300 border rounded-lg bg-background/50 border-border/50 hover:bg-background/80 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
                      {/* Add subtle gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative z-10">
                        <div className="mb-3 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                          <item.icon className="w-4 h-4 transition-colors group-hover:text-primary" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold transition-colors group-hover:text-primary">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-10 sm:mt-16"
              >
                <div className="p-4 sm:p-8 border shadow-lg rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 border-primary/20 shadow-primary/5 backdrop-blur-sm relative overflow-hidden">
                  {/* Add shine effect */}
                  <motion.div
                    initial={{ opacity: 0, x: "-100%" }}
                    animate={{
                      opacity: [0, 0.5, 0],
                      x: ["100%", "100%", "300%"],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 7,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                  />

                  <div className="flex items-start space-x-3 relative z-10">
                    <span className="text-2xl sm:text-3xl text-primary">❝</span>
                    <p className="text-base sm:text-lg md:text-xl font-medium leading-relaxed text-transparent bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text">
                      Nebriq brings simplicity back to note-taking, letting you
                      focus on what truly matters - your thoughts and ideas.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section
          id="features-overview"
          className="relative py-16 sm:py-20 md:py-24"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

          <div className="relative z-10 px-4 sm:px-6 mx-auto max-w-7xl">
            <div className="mb-10 sm:mb-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 mb-4 border rounded-full border-primary/20 bg-background/80 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Core Features
                </span>
              </motion.div>
              <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                Simple Writing, Smart Organization
              </h2>
              <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
                Just write. AI automatically connects and organizes your notes
                behind the scenes.
              </p>
            </div>

            <div className="space-y-16 sm:space-y-20 md:space-y-24">
              {/* AI-Powered Insights */}
              <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-12 items-center">
                <div className="w-full md:w-3/5">
                  <div className="relative aspect-[16/9] rounded-lg sm:rounded-xl overflow-hidden border border-primary/20">
                    <Image
                      src={getImageUrl("intelligentSearch")}
                      alt="AI-powered search and insights"
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
                  </div>
                </div>
                <div className="w-full md:w-2/5 space-y-4 sm:space-y-6 mt-4 md:mt-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Smart Analysis
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    AI-Powered Insights
                  </h3>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    Write naturally while our AI works behind the scenes. It
                    understands your notes, suggests relevant connections, and
                    helps you discover insights you might have missed.
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Automatic note linking
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Smart suggestions
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Content analysis
                    </li>
                  </ul>
                </div>
              </div>

              {/* Knowledge Graph */}
              <div className="flex flex-col md:flex-row-reverse gap-6 sm:gap-8 md:gap-12 items-center">
                <div className="w-full md:w-3/5">
                  <div className="relative aspect-[16/9] rounded-lg sm:rounded-xl overflow-hidden border border-primary/20">
                    <Image
                      src={getImageUrl("graph")}
                      alt="Interactive knowledge graph"
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
                  </div>
                </div>
                <div className="w-full md:w-2/5 space-y-4 sm:space-y-6 mt-4 md:mt-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <Waypoints className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Visual Connections
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    Knowledge Graph
                  </h3>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    Visualize how your ideas connect. Our interactive knowledge
                    graph helps you explore relationships between notes and
                    discover new patterns in your thinking.
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Interactive visualization
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Pattern discovery
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Relationship mapping
                    </li>
                  </ul>
                </div>
              </div>

              {/* Smart Assistant */}
              <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-12 items-center">
                <div className="w-full md:w-3/5">
                  <div className="relative aspect-[16/9] rounded-lg sm:rounded-xl overflow-hidden border border-primary/20">
                    <Image
                      src={getImageUrl("briq")}
                      alt="Briq AI Assistant"
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
                  </div>
                </div>
                <div className="w-full md:w-2/5 space-y-4 sm:space-y-6 mt-4 md:mt-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <BotMessageSquare className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      AI Assistant
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    Smart Assistant
                  </h3>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    Your personal AI research assistant. Ask questions about
                    your notes, get instant summaries, and find information
                    quickly without manual searching.
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Natural language queries
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Instant summaries
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Smart search
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Essential Tools Section */}
        <section className="relative py-16 sm:py-20 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

          <div className="relative z-10 px-4 sm:px-6 mx-auto max-w-7xl">
            <div className="mb-10 sm:mb-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 mb-4 border rounded-full border-primary/20 bg-background/80 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Essential Tools
                </span>
              </motion.div>
              <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                Powerful, Yet Simple
              </h2>
              <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
                All the tools you need to write effectively, wrapped in a clean,
                distraction-free design. No complexity, just smooth writing
                experience.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-8 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Focus Mode",
                  description:
                    "Write without distractions in a clean, minimal environment",
                  icon: Maximize,
                },
                {
                  title: "No Folders Needed",
                  description:
                    "Everything in one place - just write and let your ideas flow",
                  icon: FolderX,
                },
                {
                  title: "Always in Sync",
                  description: "Access your notes instantly on any device",
                  icon: Cloud,
                },
                {
                  title: "Rich Formatting",
                  description:
                    "Style your notes exactly how you want with Markdown",
                  icon: Type,
                },
                {
                  title: "LaTeX Support",
                  description: "Write mathematical expressions with ease",
                  icon: Sigma,
                },
                {
                  title: "Code Blocks",
                  description: "Share and format code with syntax highlighting",
                  icon: Code,
                },
                {
                  title: "Quick Labels",
                  description:
                    "Add light touches of context without getting lost in organization",
                  icon: Tag,
                },
                {
                  title: "Smart Search",
                  description: "Find anything instantly with semantic search",
                  icon: Search,
                },
              ].map((feature, index) => (
                <FuturisticCard
                  key={feature.title}
                  delay={index * 0.1}
                  className="backdrop-blur-sm"
                >
                  <div className="space-y-2 sm:space-y-3">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    <h3 className="text-base sm:text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </FuturisticCard>
              ))}
            </div>
          </div>
        </section>

        {/* Powerful Editor Section */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          {/* Atmospheric background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
          <div className="absolute inset-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -left-1/4 top-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[100px]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 7, repeat: Infinity, delay: 1 }}
              className="absolute -right-1/4 bottom-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[100px]"
            />
          </div>

          <div className="relative z-10 px-4 sm:px-6 mx-auto max-w-7xl">
            <div className="mb-8 sm:mb-12 md:mb-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-primary/10 backdrop-blur-sm"
              >
                <Type className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Powerful Editor
                </span>
              </motion.div>
              <h2 className="mb-3 sm:mb-4 md:mb-6 text-2xl sm:text-3xl font-bold md:text-4xl lg:text-5xl">
                Write Without Limits
              </h2>
              <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-muted-foreground">
                A powerful editor that stays out of your way. Focus on writing
                while AI works in the background.
              </p>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative aspect-[16/10] sm:aspect-video rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-2xl shadow-primary/10"
              >
                <Image
                  src={getImageUrl("editor")}
                  alt="Nebriq Editor"
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90" />

                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 md:p-8 lg:p-12">
                  <div className="max-w-3xl mx-auto space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
                    <div className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full bg-primary/10 backdrop-blur-md">
                      <Maximize className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-primary" />
                      <span className="text-[10px] sm:text-xs md:text-sm font-medium text-primary">
                        Distraction Free
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground">
                      Focus on Writing
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground/90 max-w-2xl">
                      A clean, minimal interface that lets you focus on what
                      matters most - your ideas. No cluttered toolbars, just
                      pure writing bliss.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-16 sm:py-24 bg-muted/30">
          <div className="px-4 sm:px-6 mx-auto text-center max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="mb-4 sm:mb-6">
                Early Access
              </Badge>
              <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl font-bold">
                Focus on What Matters
              </h2>
              <p className="mb-6 sm:mb-8 text-base sm:text-lg text-muted-foreground">
                Join us in building a simpler way to write and think.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80"
                onClick={scrollToHero}
              >
                Join Waitlist
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-background">
          <div className="px-4 sm:px-6 py-8 sm:py-12 mx-auto max-w-7xl">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 gap-6 sm:gap-8 mb-6 sm:mb-8 sm:grid-cols-2 md:grid-cols-3">
              {/* Company Info */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-sm sm:text-base font-semibold">About</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="https://microlaunch.net/p/nebriq"
                      className="text-xs sm:text-sm transition-colors text-muted-foreground hover:text-foreground"
                    >
                      Microlaunch
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-sm sm:text-base font-semibold">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/terms"
                      className="text-xs sm:text-sm transition-colors text-muted-foreground hover:text-foreground"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-xs sm:text-sm transition-colors text-muted-foreground hover:text-foreground"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Connect */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-sm sm:text-base font-semibold">Connect</h3>
                <div className="flex space-x-4">
                  <Link
                    href="https://x.com/getnebriq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                  <Link
                    href="mailto:hi@nebriq.com"
                    className="transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </div>
              </div>
            </div>

            <Separator className="my-4 sm:my-6 md:my-8" />

            {/* Bottom Footer */}
            <div className="flex flex-col items-center justify-between space-y-3 md:flex-row md:space-y-0 text-center md:text-left">
              <span className="text-xs sm:text-sm text-muted-foreground">
                © {new Date().getFullYear()} Nebriq. All rights reserved.
              </span>

              <div className="flex items-center space-x-1 text-xs sm:text-sm text-muted-foreground">
                <span>Built with</span>
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 mx-1 text-primary/80" />
                <span>by</span>
                <Link
                  href="https://paulbg.dev"
                  className="ml-1 transition-colors text-muted-foreground hover:text-foreground"
                >
                  Paul Bogatyr
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

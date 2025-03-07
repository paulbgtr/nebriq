"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { motion } from "framer-motion";
import {
  Sparkles,
  Search,
  Twitter,
  Heart,
  Settings,
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
  StickyNote,
} from "lucide-react";
import { ModeToggle } from "@/modules/landing-page/features/theme-switcher";
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
import { NeuralNetwork } from "@/modules/landing-page/features/visuals/neural-network";
import { FaArrowUp } from "react-icons/fa";
import { KnowledgeGraphVisualization } from "@/modules/landing-page/features/visuals/knowledge-graph-visualization";
import { SemanticConnectionsVisualization } from "@/modules/landing-page/features/visuals/semantic-connections-visualization";
import { SmartLibraryVisualization } from "@/modules/landing-page/features/visuals/smart-library-visualization";
import { EditorVisualization } from "@/modules/landing-page/features/visuals/editor-visualization";

const wishListSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email is too long")
    .trim()
    .toLowerCase(),
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          className="fixed top-6 inset-x-0 z-50 px-4"
        >
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
                      <Compass
                        className="w-5 h-5 text-primary"
                        strokeWidth={1.5}
                      />
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
          className="relative flex items-center justify-center min-h-[90vh] pt-32 pb-24 md:pb-12 lg:pb-6 overflow-hidden"
        >
          {/* Floating elements */}
          <div className="absolute inset-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute rounded-full top-1/4 -left-20 w-60 h-60 bg-primary/20 blur-[100px]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 7, repeat: Infinity, delay: 1 }}
              className="absolute rounded-full bottom-1/4 -right-20 w-80 h-80 bg-secondary/20 blur-[100px]"
            />
            {/* Additional ambient light effects */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 8, repeat: Infinity, delay: 2 }}
              className="absolute rounded-full top-1/2 left-1/3 w-40 h-40 bg-blue-500/20 blur-[80px]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 6, repeat: Infinity, delay: 3 }}
              className="absolute rounded-full bottom-1/3 right-1/3 w-32 h-32 bg-purple-500/20 blur-[60px]"
            />
          </div>

          {/* Futuristic grid pattern background - matching Essential Tools section */}
          <div className="absolute inset-0 opacity-5">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Main content */}
          <div className="relative z-10 px-4 mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center space-y-16"
            >
              {/* Hero title */}
              <motion.div
                className="relative space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.21, 0.45, 0.27, 0.99],
                }}
              >
                {/* Decorative elements */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                  className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1 mb-4 border rounded-full border-primary/20 bg-background/80 backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    AI-Powered Writing
                  </span>
                </motion.div>

                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground/80 relative"
                    >
                      Write.
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                      />
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80 relative"
                    >
                      Ask.
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                        className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                      />
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.9 }}
                      className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 relative"
                    >
                      Know.
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8, delay: 1.6 }}
                        className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
                      />
                    </motion.span>
                  </div>
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed"
                >
                  A simple writing space that uses AI to keep your notes
                  organized and your knowledge accessible.
                </motion.p>

                {/* Decorative line */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 1, delay: 1.4 }}
                  className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-primary/30 to-transparent mt-6"
                />
              </motion.div>

              {/* CTA Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="max-w-xl mx-auto"
              >
                <div className="relative group">
                  <div className="absolute transition-all duration-500 rounded-lg -inset-1 bg-gradient-to-r from-primary/50 via-primary/30 to-primary/50 blur-lg group-hover:blur-xl" />
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="relative flex gap-4 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-primary/10"
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
                                className="h-12 bg-transparent border-primary/20 focus:border-primary/50 transition-colors"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 px-8 transition-all duration-300 bg-primary/90 hover:bg-primary hover:scale-[1.02] shadow-md hover:shadow-lg shadow-primary/10 hover:shadow-primary/20"
                      >
                        <span className="relative z-10">Join Waitlist</span>
                      </Button>
                    </form>
                  </Form>
                </div>
              </motion.div>

              {/* Feature Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-wrap justify-center gap-3 px-4"
              >
                {[
                  {
                    icon: Sparkles,
                    text: "AI-Powered",
                    color: "from-blue-500/20 to-blue-600/10",
                    glowColor: "rgba(59, 130, 246, 0.3)",
                  },
                  {
                    icon: Waypoints,
                    text: "Dynamic Knowledge Maps",
                    color: "from-purple-500/20 to-purple-600/10",
                    glowColor: "rgba(124, 58, 237, 0.3)",
                  },
                  {
                    icon: FolderX,
                    text: "No Folders",
                    color: "from-green-500/20 to-green-600/10",
                    glowColor: "rgba(16, 185, 129, 0.3)",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 1.2 + index * 0.1,
                      ease: "easeOut",
                    }}
                    className="relative group"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{
                        opacity: [0.4, 0.3, 0.4],
                        scale: [0.98, 1.02, 0.98],
                      }}
                      transition={{
                        duration: 3,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      style={{ backgroundColor: feature.glowColor }}
                      className="absolute inset-0 transition-all duration-700 rounded-full blur-xl group-hover:blur-2xl opacity-20"
                    />
                    <div
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r ${feature.color} backdrop-blur-sm border border-primary/10 shadow-sm relative z-10`}
                    >
                      <div className="relative w-4 h-4 flex items-center justify-center">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/10"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 0.9, 0.7],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                        <feature.icon className="w-4 h-4 text-primary relative z-10" />
                      </div>
                      <span className="text-sm font-medium">
                        {feature.text}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Futuristic 3D Visualization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="relative w-full max-w-[90vw] mx-auto mt-8"
              >
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-primary/20 shadow-xl shadow-primary/5">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 blur-2xl" />

                  {/* Interactive Knowledge Graph Visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <KnowledgeGraphVisualization />
                  </div>

                  {/* Floating UI Elements */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                    className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg bg-background/40 backdrop-blur-md border border-primary/20 shadow-lg shadow-primary/5"
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative w-5 h-5 flex items-center justify-center">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/10"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 0.9, 0.7],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                        <Type className="w-5 h-5 text-primary relative z-10" />
                      </div>
                      <span className="text-sm font-medium">
                        Write your thoughts
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.6 }}
                    className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 p-4 rounded-lg bg-background/60 backdrop-blur-md border border-blue-400/30 shadow-lg shadow-blue-400/10"
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative w-5 h-5 flex items-center justify-center">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-blue-400/10"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 0.9, 0.7],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                        <BotMessageSquare className="w-5 h-5 text-blue-400 relative z-10" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        Ask questions
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.8 }}
                    className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 translate-y-1/2 p-4 rounded-lg bg-background/40 backdrop-blur-md border border-primary/20 shadow-lg shadow-primary/5"
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative w-5 h-5 flex items-center justify-center">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/10"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 0.9, 0.7],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                        <Sigma className="w-5 h-5 text-primary relative z-10" />
                      </div>
                      <span className="text-sm font-medium">
                        Discover connections
                      </span>
                    </div>
                  </motion.div>

                  {/* Animated connection lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <motion.path
                      d="M25%,25% Q50%,15% 75%,50%"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.3 }}
                      transition={{ duration: 1.5, delay: 2 }}
                      fill="none"
                      stroke="url(#lineGradient1)"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                    <motion.path
                      d="M75%,50% Q60%,70% 50%,75%"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.3 }}
                      transition={{ duration: 1.5, delay: 2.2 }}
                      fill="none"
                      stroke="url(#lineGradient2)"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                    />
                    <defs>
                      <linearGradient
                        id="lineGradient1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          stopColor="var(--primary)"
                          stopOpacity="0.5"
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--secondary)"
                          stopOpacity="0.5"
                        />
                      </linearGradient>
                      <linearGradient
                        id="lineGradient2"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          stopColor="var(--secondary)"
                          stopOpacity="0.5"
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--primary)"
                          stopOpacity="0.5"
                        />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-transparent opacity-50" />
                </div>

                {/* Subtle pulse effect at the bottom */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full bg-primary/10 blur-3xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Problem Statement Section */}
        <section
          id="problem"
          className="relative py-16 sm:py-24 mt-16 sm:mt-32"
        >
          {/* Dynamic background with subtle animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />

            {/* Futuristic grid pattern background - matching Essential Tools section */}
            <div className="absolute inset-0 opacity-5">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              {/* Section header with visual indicator */}
              <div className="flex flex-col items-center mb-16">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: "60px" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="w-px bg-gradient-to-b from-transparent via-primary/50 to-primary/80 mb-6"
                />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-3 py-1 mb-4 border rounded-full border-primary/20 bg-background/80 backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    The Reality
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="text-3xl font-bold text-center md:text-4xl lg:text-5xl [text-wrap:balance]"
                >
                  <span className="relative">
                    <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground">
                      Your thoughts deserve better tools
                    </span>
                    <motion.span
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 1 }}
                      className="absolute bottom-2 left-0 h-[6px] bg-primary/10 -z-0"
                    />
                  </span>
                </motion.h2>
              </div>

              {/* Main problem statement */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="relative p-8 mb-16 overflow-hidden border rounded-xl border-primary/10 bg-background/60 backdrop-blur-md"
              >
                {/* Decorative elements */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: [0.4, 0.3, 0.4],
                    scale: [0.98, 1.02, 0.98],
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="absolute top-0 left-0 w-20 h-20 -translate-x-1/2 -translate-y-1/2 bg-primary/20 blur-3xl rounded-full"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: [0.4, 0.3, 0.4],
                    scale: [0.98, 1.02, 0.98],
                  }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1,
                  }}
                  className="absolute bottom-0 right-0 w-20 h-20 translate-x-1/2 translate-y-1/2 bg-blue-500/20 blur-3xl rounded-full"
                />

                <div className="relative">
                  <p className="text-xl leading-relaxed text-foreground/90 md:text-2xl">
                    Current note-taking tools force a choice:
                    <span className="relative inline-block px-1">
                      <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                        structure
                      </span>
                      <span className="absolute bottom-0 left-0 w-full h-[6px] bg-red-500/20 -z-0" />
                    </span>
                    or
                    <span className="relative inline-block px-1">
                      <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-500">
                        freedom
                      </span>
                      <span className="absolute bottom-0 left-0 w-full h-[6px] bg-green-500/20 -z-0" />
                    </span>
                    . You either spend hours organizing or lose track of what
                    matters.
                  </p>
                </div>
              </motion.div>

              {/* Problem cards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Mental Overhead",
                    icon: Settings,
                    description:
                      "Every thought requires a decision: where to put it, how to tag it, how to find it again. Your brain is busy filing, not thinking.",
                    color: "from-red-500/80 to-orange-500/80",
                    shadowColor: "shadow-red-500/10",
                    iconBg: "bg-red-500/10",
                    glowColor: "rgba(239, 68, 68, 0.3)",
                  },
                  {
                    title: "Fragmented Knowledge",
                    icon: FolderX,
                    description:
                      "Your notes exist in isolation. The connections between ideas—the most valuable part—remain trapped in your head.",
                    color: "from-blue-500/80 to-sky-500/80",
                    shadowColor: "shadow-blue-500/10",
                    iconBg: "bg-blue-500/10",
                    glowColor: "rgba(59, 130, 246, 0.3)",
                  },
                  {
                    title: "Lost Context",
                    icon: Compass,
                    description:
                      "Finding notes isn't enough. You need to remember why you wrote them and how they connect to your current thinking.",
                    color: "from-purple-500/80 to-violet-500/80",
                    shadowColor: "shadow-purple-500/10",
                    iconBg: "bg-purple-500/10",
                    glowColor: "rgba(124, 58, 237, 0.3)",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="relative group"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{
                        opacity: [0.4, 0.3, 0.4],
                        scale: [0.98, 1.02, 0.98],
                      }}
                      transition={{
                        duration: 3,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      style={{ backgroundColor: item.glowColor }}
                      className="absolute inset-0 transition-all duration-700 rounded-xl blur-2xl group-hover:blur-3xl opacity-20"
                    />
                    <div className="relative h-full p-6 overflow-hidden transition-all duration-300 border rounded-lg bg-background/60 backdrop-blur-sm border-primary/10 hover:shadow-lg hover:-translate-y-1 z-10">
                      {/* Gradient accent */}
                      <div
                        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-80"
                        style={{
                          backgroundImage: `linear-gradient(to right, ${item.color
                            .split(" ")[0]
                            .replace("from-", "")}, ${item.color
                            .split(" ")[1]
                            .replace("to-", "")})`,
                        }}
                      />

                      {/* Icon with background */}
                      <div className="relative w-12 h-12 flex items-center justify-center mb-4">
                        <motion.div
                          className={`absolute inset-0 rounded-full ${item.iconBg}`}
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 0.9, 0.7],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                        <item.icon
                          className={`w-6 h-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r ${item.color} relative z-10`}
                        />
                      </div>

                      <h3 className="mb-2 text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80">
                        {item.title}
                      </h3>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Solution statement */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.9 }}
                className="mt-16 relative group"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: [0.4, 0.3, 0.4],
                    scale: [0.98, 1.02, 0.98],
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  style={{ backgroundColor: "rgba(var(--primary-rgb), 0.3)" }}
                  className="absolute inset-0 transition-all duration-700 rounded-xl blur-2xl group-hover:blur-3xl opacity-20"
                />
                <div className="relative p-8 overflow-hidden border rounded-xl bg-gradient-to-br from-background/80 to-background/60 border-primary/20 backdrop-blur-md shadow-lg z-10">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 translate-x-1/2 -translate-y-1/2 bg-primary/10 blur-3xl rounded-full" />

                  <div className="relative flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/10"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 0.9, 0.7],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                        <Sparkles className="w-6 h-6 text-primary relative z-10" />
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80 md:text-2xl">
                        What if your notes worked like your brain?
                      </h3>

                      <p className="text-lg leading-relaxed text-muted-foreground">
                        Nebriq lets you capture thoughts naturally. No folders.
                        No tags. Just write. The AI works silently to connect
                        ideas, surface relevant context, and build your personal
                        knowledge network—exactly when you need it.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="features-overview" className="relative py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

          {/* Futuristic grid pattern background */}
          <div className="absolute inset-0 opacity-5">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="relative z-10 px-6 mx-auto max-w-7xl">
            <div className="mb-16 text-center">
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
              <h2 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground">
                  Simple Writing, Smart Organization
                </span>
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                Just write. AI automatically connects and organizes your notes
                behind the scenes.
              </p>
            </div>

            <div className="space-y-24">
              {/* AI-Powered Insights */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                <div className="w-full md:w-3/5 relative group">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: [0.4, 0.3, 0.4],
                      scale: [0.98, 1.02, 0.98],
                    }}
                    transition={{
                      duration: 3,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    style={{ backgroundColor: "rgba(var(--primary-rgb), 0.3)" }}
                    className="absolute inset-0 transition-all duration-700 rounded-xl blur-2xl group-hover:blur-3xl opacity-20"
                  />
                  <div className="relative rounded-xl overflow-hidden border border-primary/20 bg-card p-4 shadow-md backdrop-blur-sm">
                    <div className="flex flex-col space-y-4 h-[300px]">
                      {/* Chat header */}
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <div className="flex items-center gap-2">
                          <div className="relative w-5 h-5 flex items-center justify-center">
                            <motion.div
                              className="absolute inset-0 rounded-full bg-primary/10"
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.7, 0.9, 0.7],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "reverse",
                              }}
                            />
                            <BotMessageSquare className="w-5 h-5 text-primary relative z-10" />
                          </div>
                          <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80">
                            Chat with Briq
                          </span>
                        </div>
                      </div>

                      {/* Chat messages */}
                      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {/* User message */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start gap-2 max-w-[80%] ml-auto">
                            <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none">
                              <p>
                                What are the key points from my meeting notes
                                yesterday?
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Bot message with note reference */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start gap-2 max-w-[80%]">
                            <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                              <p className="mb-2">
                                Based on your meeting notes from yesterday, here
                                are the key points:
                              </p>
                              <ul className="space-y-1 pl-4 list-disc">
                                <li>
                                  Project deadline extended to next Friday
                                </li>
                                <li>
                                  New feature requirements added to sprint
                                </li>
                                <li>Team agreed on weekly progress updates</li>
                              </ul>
                              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                <StickyNote className="w-3 h-3" />
                                <span>From: Meeting Notes (Apr 15)</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* User follow-up */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start gap-2 max-w-[80%] ml-auto">
                            <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none">
                              <p>What were the new feature requirements?</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Chat input */}
                      <div className="relative">
                        <div className="flex items-center gap-2 p-2 rounded-lg border border-input bg-background">
                          <input
                            type="text"
                            className="flex-1 bg-transparent border-none outline-none text-sm"
                            placeholder="Ask about your notes..."
                            disabled
                          />
                          <Button
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            disabled
                          >
                            <FaArrowUp className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-2/5 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <div className="relative w-4 h-4 flex items-center justify-center">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/10"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.7, 0.9, 0.7],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />
                      <Sparkles className="w-4 h-4 text-primary relative z-10" />
                    </div>
                    <span className="text-sm font-medium text-primary">
                      Smart Analysis
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80">
                    Chat with Your Notes
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Ask questions about your notes in simple language and get
                    immediate answers. Our AI understands the context across all
                    your notes and delivers relevant insights with source
                    references.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Natural language queries
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Sources linked to answers
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Cross-note understanding
                    </li>
                  </ul>
                </div>
              </div>

              {/* Knowledge Graph */}
              <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-12 items-center">
                <div className="w-full md:w-3/5 relative group">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: [0.4, 0.3, 0.4],
                      scale: [0.98, 1.02, 0.98],
                    }}
                    transition={{
                      duration: 3,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    style={{ backgroundColor: "rgba(124, 58, 237, 0.3)" }}
                    className="absolute inset-0 transition-all duration-700 rounded-xl blur-2xl group-hover:blur-3xl opacity-20"
                  />
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-primary/20 bg-card backdrop-blur-sm">
                    <KnowledgeGraphVisualization />
                  </div>
                </div>
                <div className="w-full md:w-2/5 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <div className="relative w-4 h-4 flex items-center justify-center">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/10"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.7, 0.9, 0.7],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />
                      <Waypoints className="w-4 h-4 text-primary relative z-10" />
                    </div>
                    <span className="text-sm font-medium text-primary">
                      Visual Connections
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80">
                    Knowledge Graph
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Visualize how your ideas connect. Our interactive knowledge
                    graph helps you explore relationships between notes and
                    discover new patterns in your thinking.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Interactive visualization
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Pattern discovery
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Relationship mapping
                    </li>
                  </ul>
                </div>
              </div>

              {/* Semantic Connections */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                <div className="w-full md:w-3/5 relative group">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: [0.4, 0.3, 0.4],
                      scale: [0.98, 1.02, 0.98],
                    }}
                    transition={{
                      duration: 3,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    style={{ backgroundColor: "rgba(59, 130, 246, 0.3)" }}
                    className="absolute inset-0 transition-all duration-700 rounded-xl blur-2xl group-hover:blur-3xl opacity-20"
                  />
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-primary/20 bg-card backdrop-blur-sm">
                    <SemanticConnectionsVisualization />
                  </div>
                </div>
                <div className="w-full md:w-2/5 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <div className="relative w-4 h-4 flex items-center justify-center">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/10"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.7, 0.9, 0.7],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />
                      <Waypoints className="w-4 h-4 text-primary relative z-10" />
                    </div>
                    <span className="text-sm font-medium text-primary">
                      Semantic Connections
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80">
                    Discover Connections While Writing
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Our AI automatically identifies connections between your
                    notes as you write. See related content without breaking
                    your flow, helping you build a more interconnected knowledge
                    base.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Real-time connection discovery
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Content and title matching
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      One-click navigation to related notes
                    </li>
                  </ul>
                </div>
              </div>

              {/* Smart Library */}
              <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-12 items-center">
                <div className="w-full md:w-3/5 relative group">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: [0.4, 0.3, 0.4],
                      scale: [0.98, 1.02, 0.98],
                    }}
                    transition={{
                      duration: 3,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    style={{ backgroundColor: "rgba(var(--primary-rgb), 0.3)" }}
                    className="absolute inset-0 transition-all duration-700 rounded-xl blur-2xl group-hover:blur-3xl opacity-20"
                  />
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-primary/20 bg-card backdrop-blur-sm">
                    <SmartLibraryVisualization />
                  </div>
                </div>
                <div className="w-full md:w-2/5 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <div className="relative w-4 h-4 flex items-center justify-center">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/10"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.7, 0.9, 0.7],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />
                      <BotMessageSquare className="w-4 h-4 text-primary relative z-10" />
                    </div>
                    <span className="text-sm font-medium text-primary">
                      Smart Library
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80">
                    Your Notes, Automatically Organized
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Don&apos;t worry about complex organization systems. Your
                    notes are automatically categorized and easily accessible.
                    Browse them naturally when you want to explore without AI
                    assistance.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Smart categorization
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Flexible viewing options
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Quick search and filters
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Essential Tools Section */}
        <section className="relative py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

          {/* Futuristic grid pattern background */}
          <div className="absolute inset-0 opacity-5">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="relative z-10 px-6 mx-auto max-w-7xl">
            <div className="mb-16 text-center">
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
              <h2 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground">
                  Minimalist Design, Maximum Power
                </span>
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                Cutting-edge tools engineered for the future of writing, with an
                interface that fades away to let your ideas take center stage.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 mt-16 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Neural Focus",
                  description:
                    "AI-enhanced environment that adapts to your flow state and eliminates distractions",
                  icon: Maximize,
                  glowColor: "rgba(var(--primary-rgb), 0.3)",
                  variant: "neon" as const,
                },
                {
                  title: "Fluid Organization",
                  description:
                    "Transcend traditional hierarchies with a system that evolves with your thinking",
                  icon: FolderX,
                  glowColor: "rgba(124, 58, 237, 0.3)",
                  variant: "neon" as const,
                },
                {
                  title: "Quantum Sync",
                  description:
                    "Instantaneous multi-device synchronization with zero latency",
                  icon: Cloud,
                  glowColor: "rgba(59, 130, 246, 0.3)",
                  variant: "neon" as const,
                },
                {
                  title: "Adaptive Formatting",
                  description:
                    "Context-aware styling that intuitively responds to your content",
                  icon: Type,
                  glowColor: "rgba(var(--primary-rgb), 0.3)",
                  variant: "neon" as const,
                },
                {
                  title: "Mathematical Engine",
                  description:
                    "Seamlessly integrate complex equations with real-time rendering",
                  icon: Sigma,
                  glowColor: "rgba(16, 185, 129, 0.3)",
                  variant: "neon" as const,
                },
                {
                  title: "Code Intelligence",
                  description:
                    "Smart syntax highlighting with AI-powered code suggestions",
                  icon: Code,
                  glowColor: "rgba(245, 158, 11, 0.3)",
                  variant: "neon" as const,
                },
                {
                  title: "Contextual Tagging",
                  description:
                    "Automatic semantic labeling that creates meaningful connections",
                  icon: Tag,
                  glowColor: "rgba(236, 72, 153, 0.3)",
                  variant: "neon" as const,
                },
                {
                  title: "Cognitive Search",
                  description:
                    "Thought-based retrieval that understands intent, not just keywords",
                  icon: Search,
                  glowColor: "rgba(79, 70, 229, 0.3)",
                  variant: "neon" as const,
                },
              ].map((feature, index) => (
                <FuturisticCard
                  key={feature.title}
                  delay={index * 0.1}
                  className="backdrop-blur-sm h-full"
                  glowColor={feature.glowColor}
                  variant={feature.variant}
                >
                  <div className="space-y-4">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/10"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.7, 0.9, 0.7],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />
                      <feature.icon className="w-6 h-6 text-primary relative z-10" />
                    </div>
                    <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </FuturisticCard>
              ))}
            </div>
          </div>
        </section>

        {/* Powerful Editor Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Atmospheric background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

          {/* Futuristic grid pattern background */}
          <div className="absolute inset-0 opacity-5">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

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
            <div className="mb-12 sm:mb-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 mb-4 border rounded-full border-primary/20 bg-background/80 backdrop-blur-sm"
              >
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/10"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 0.9, 0.7],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                  <Type className="w-4 h-4 text-primary relative z-10" />
                </div>
                <span className="text-sm font-medium text-primary">
                  Powerful Editor
                </span>
              </motion.div>
              <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold md:text-4xl lg:text-5xl">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground">
                  Write Without Limits
                </span>
              </h2>
              <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
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
                className="relative group"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: [0.4, 0.3, 0.4],
                    scale: [0.98, 1.02, 0.98],
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  style={{ backgroundColor: "rgba(var(--primary-rgb), 0.3)" }}
                  className="absolute inset-0 transition-all duration-700 rounded-xl sm:rounded-2xl blur-2xl group-hover:blur-3xl opacity-20"
                />
                <div className="relative aspect-[16/10] sm:aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-primary/20 backdrop-blur-sm">
                  <EditorVisualization />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90" />

                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 md:p-8 lg:p-12">
                    <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20">
                        <div className="relative w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center">
                          <motion.div
                            className="absolute inset-0 rounded-full bg-primary/10"
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.7, 0.9, 0.7],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                          />
                          <Maximize className="w-3 h-3 sm:w-4 sm:h-4 text-primary relative z-10" />
                        </div>
                        <span className="text-[10px] sm:text-xs md:text-sm font-medium text-primary">
                          Distraction Free
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80">
                        Focus on Writing
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                        A clean, minimal interface that lets you focus on what
                        matters most - your ideas. No cluttered toolbars, just
                        pure writing bliss.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="relative py-24 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />

          {/* Futuristic grid pattern background */}
          <div className="absolute inset-0 opacity-5">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="w-full h-full"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="absolute inset-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -left-1/4 top-1/3 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 10, repeat: Infinity, delay: 1 }}
              className="absolute -right-1/4 bottom-1/3 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px]"
            />
          </div>

          <div className="relative z-10 px-6 mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left side: Content */}
              <motion.div
                className="text-left space-y-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                  <div className="relative w-4 h-4 flex items-center justify-center">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/10"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 0.9, 0.7],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />
                    <Sparkles className="w-4 h-4 text-primary relative z-10" />
                  </div>
                  <span className="text-sm font-medium text-primary">
                    Early Access
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground">
                    Focus on What Matters
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-md">
                  Join us in building a simpler way to write and think. Be among
                  the first to experience the future of note-taking.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <div className="relative group">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{
                        opacity: [0.4, 0.3, 0.4],
                        scale: [0.98, 1.02, 0.98],
                      }}
                      transition={{
                        duration: 3,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      style={{
                        backgroundColor: "rgba(var(--primary-rgb), 0.3)",
                      }}
                      className="absolute inset-0 transition-all duration-700 rounded-md blur-xl group-hover:blur-2xl opacity-30"
                    />
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 group transition-all duration-300 relative border border-primary/20"
                      onClick={scrollToHero}
                    >
                      <span className="relative z-10">Join Waitlist</span>
                      <motion.div
                        className="ml-2 relative z-10"
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                      >
                        →
                      </motion.div>
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Right side: Visual */}
              <motion.div
                className="relative aspect-square max-w-md mx-auto hidden md:block"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Decorative elements */}
                    <motion.div
                      className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full border-2 border-primary/20"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <motion.div
                      className="absolute top-1/3 left-1/3 w-1/3 h-1/3 rounded-full border-2 border-primary/30"
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    {/* Central icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{
                            opacity: [0.4, 0.3, 0.4],
                            scale: [0.98, 1.02, 0.98],
                          }}
                          transition={{
                            duration: 3,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                          style={{
                            backgroundColor: "rgba(var(--primary-rgb), 0.3)",
                          }}
                          className="absolute inset-0 transition-all duration-700 rounded-full blur-2xl opacity-30"
                        />
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 backdrop-blur-sm relative">
                          <div className="relative w-10 h-10 flex items-center justify-center">
                            <motion.div
                              className="absolute inset-0 rounded-full bg-primary/10"
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.7, 0.9, 0.7],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                repeatType: "reverse",
                              }}
                            />
                            <BotMessageSquare className="w-10 h-10 text-primary relative z-10" />
                          </div>
                        </div>
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          animate={{
                            boxShadow: [
                              "0 0 0 0 rgba(147, 51, 234, 0.3)",
                              "0 0 0 10px rgba(147, 51, 234, 0)",
                              "0 0 0 0 rgba(147, 51, 234, 0)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </div>

                    {/* Floating elements */}
                    <motion.div
                      className="absolute top-10 right-20 w-12 h-12 rounded-lg bg-card border border-primary/20 flex items-center justify-center shadow-md backdrop-blur-sm"
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/10"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 0.9, 0.7],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                        <BookOpen className="w-6 h-6 text-primary relative z-10" />
                      </div>
                    </motion.div>
                    <motion.div
                      className="absolute bottom-20 left-20 w-10 h-10 rounded-lg bg-card border border-primary/20 flex items-center justify-center shadow-md backdrop-blur-sm"
                      animate={{ y: [0, 8, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 1,
                      }}
                    >
                      <div className="relative w-5 h-5 flex items-center justify-center">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/10"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 0.9, 0.7],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                        <Sparkles className="w-5 h-5 text-primary relative z-10" />
                      </div>
                    </motion.div>
                    <motion.div
                      className="absolute top-1/3 right-10 w-8 h-8 rounded-lg bg-card border border-primary/20 flex items-center justify-center shadow-md backdrop-blur-sm"
                      animate={{ y: [0, 6, 0] }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 0.5,
                      }}
                    >
                      <div className="relative w-4 h-4 flex items-center justify-center">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/10"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 0.9, 0.7],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                        <Search className="w-4 h-4 text-primary relative z-10" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-background">
          <div className="px-4 sm:px-6 py-8 sm:py-12 mx-auto max-w-7xl">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 gap-8 mb-8 sm:grid-cols-2 md:grid-cols-3">
              {/* Company Info */}
              <div className="space-y-4">
                <h3 className="font-semibold">About</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="https://microlaunch.net/p/nebriq"
                      className="text-sm transition-colors text-muted-foreground hover:text-foreground"
                    >
                      Microlaunch
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div className="space-y-4">
                <h3 className="font-semibold">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/terms"
                      className="text-sm transition-colors text-muted-foreground hover:text-foreground"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-sm transition-colors text-muted-foreground hover:text-foreground"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Connect */}
              <div className="space-y-4">
                <h3 className="font-semibold">Connect</h3>
                <div className="flex space-x-4">
                  <Link
                    href="https://x.com/getnebriq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Twitter className="w-5 h-5" />
                  </Link>
                  <Link
                    href="mailto:hi@nebriq.com"
                    className="transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

            <Separator className="my-6 sm:my-8" />

            {/* Bottom Footer */}
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0 text-center md:text-left">
              <span className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Nebriq. All rights reserved.
              </span>

              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <span>Built with</span>
                <Heart className="w-4 h-4 mx-1 text-primary/80" />
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

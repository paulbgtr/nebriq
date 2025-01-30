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
  Clock,
  Shield,
  Settings,
  Folders,
  FolderX,
  BookOpen,
  Sigma,
  Baseline,
  Expand,
  Tag,
  Cloud,
  Code,
  Mail,
} from "lucide-react";
import { ModeToggle } from "@/modules/landing-page/features/theme-switcher";
import { useTheme } from "next-themes";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { useToast } from "@/shared/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/shared/lib/supabase/client";
import { sendEmail } from "./actions/emails/send-email";
import { Separator } from "@/shared/components/ui/separator";

const wishListSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email is too long")
    .trim()
    .toLowerCase(),
});

type ImageConfig = {
  light: string;
  dark: string;
};

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
  const [imageUrls] = useState<Record<string, ImageConfig>>(imagePaths);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { theme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getImageUrl = (imageKey: string) => {
    if (!mounted) return imageUrls[imageKey].light;

    return theme === "dark"
      ? imageUrls[imageKey].dark
      : imageUrls[imageKey].light;
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

      await sendEmail("You're on our wish list!", email);

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

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorative elements remain unchanged */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="absolute top-0 -left-1/4 w-1/2 aspect-square bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 aspect-square bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="fixed top-8 right-8 z-50">
        <ModeToggle />
      </div>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-[90vh] flex items-center"
        ref={heroRef}
      >
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/60 via-muted/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="secondary" className="animate-pulse">
                <Clock className="w-4 h-4 mr-1" />
                Early Access Opening Soon
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight">
              Start Writing.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60 animate-gradient">
                Stop Organizing.
              </span>
            </h1>

            {/* Value proposition with benefit-focused copy */}
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Clean workspace for clear thinking. Enhanced with AI for better
              learning and reflection.
            </p>

            {/* Conversion form with enhanced UX */}
            <div className="mt-8 sm:mt-12">
              <Form {...form}>
                <form
                  className="flex flex-col gap-3 max-w-md mx-auto"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                            <Input
                              {...field}
                              type="email"
                              disabled={isSubmitting}
                              placeholder="Enter your email"
                              className="pl-10 h-12 text-base border-2 transition-all focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* CTA button with enhanced visual appeal */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Join Waitlist & Get Early Access
                  </Button>
                </form>
              </Form>

              {/* Trust indicators */}
              <div className="mt-4 flex flex-col items-center gap-3">
                <Badge variant="outline" className="animate-pulse">
                  <Clock className="w-4 h-4 mr-1" />
                  Limited Beta Spots Available
                </Badge>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Free during beta • Priority support • Future discounts
                </p>
              </div>
            </div>

            {/* Feature highlights with enhanced visuals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
              {[
                {
                  icon: Search,
                  title: "Smart Search",
                  desc: "Find any note instantly, even if you don't remember the exact words",
                },
                {
                  icon: Sparkles,
                  title: "AI Insights",
                  desc: "Generate quizzes and get fresh perspectives on your notes",
                },
                {
                  icon: Folders,
                  title: "Just Write",
                  desc: "No folders or complex systems - focus purely on your ideas",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/5 transition-colors"
                >
                  <feature.icon className="h-8 w-8 text-primary mb-2" />
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Product preview with enhanced presentation */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-16 relative"
            >
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-muted border shadow-2xl">
                <Image
                  src={getImageUrl("hero")}
                  alt="nebriq's intuitive writing workspace interface"
                  fill
                  className="object-cover rounded-xl opacity-90 hover:opacity-100 transition-opacity"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section id="problem" className="relative py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="mb-6">
                The Problem
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Note-Taking Has Become{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                  Too Complex
                </span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground"
            >
              Today&apos;s note-taking tools overwhelm you with features,
              folders, and complicated workflows. They promise organization but
              deliver complexity. We believe that capturing and developing your
              ideas shouldn&apos;t require a manual.
            </motion.p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
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
                  <div className="p-6 rounded-lg bg-background/50 border border-border/50 transition-all duration-300 hover:bg-background/80 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1">
                    <div className="text-muted-foreground/50 mb-3">
                      <item.icon className="w-6 h-6 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-16"
            >
              <div className="p-8 rounded-2xl  from-primary/10 via-secondary/5 to-primary/10 border border-primary/20 shadow-lg shadow-primary/5 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <span className="text-3xl text-primary/80">❝</span>
                  <p className="text-xl font-medium leading-relaxed bg-gradient-to-r from-primary via-blue-500/90 to-sky-600 text-transparent bg-clip-text">
                    Nebriq brings simplicity back to note-taking, letting you
                    focus on what truly matters - your thoughts and ideas.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section - Core Features */}
      <section id="features-overview" className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-3">
              Core Features
            </Badge>
            <h2 className="text-3xl font-bold">Your Intellectual Ecosystem</h2>
            <p className="mt-4 text-muted-foreground">
              Precision tools designed to amplify your cognitive potential and
              research workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Feature 1 - AI Summary & Semantic Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group p-6 rounded-xl hover:bg-accent/50 transition-colors"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted border mb-6 group-hover:border-accent transition-colors">
                <Image
                  src={getImageUrl("intelligentSearch")}
                  alt="AI-Powered Insights"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full transform transition-transform scale-125"
                  priority
                />
              </div>
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-2">
                  AI-Powered
                </Badge>
                <h3 className="text-xl font-bold">
                  Find any note instantly, even if you don’t remember the exact
                  words
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find exactly what you need with context-aware search that
                  understands the meaning behind your queries. Go beyond simple
                  keyword matching to discover relevant content across your
                  notes.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 - Graph View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group p-6 rounded-xl hover:bg-accent/50 transition-colors"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted border mb-6 group-hover:border-accent transition-colors">
                <Image
                  src={getImageUrl("graph")}
                  alt="Knowledge Graph"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full transform transition-transform group-hover:scale-105"
                  priority
                />
              </div>
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-2">
                  Interactive
                </Badge>
                <h3 className="text-xl font-bold">
                  See how your ideas connect in a beautiful, interactive view
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Visualize connections between your notes in an interactive
                  graph view, revealing hidden relationships and patterns in
                  your knowledge network.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 - AI Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group p-6 rounded-xl hover:bg-accent/50 transition-colors"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted border mb-6 group-hover:border-accent transition-colors">
                <Image
                  src={getImageUrl("briq")}
                  alt="AI Summary"
                  width={1200}
                  height={900}
                  className="object-cover w-full h-full transform transition-transform group-hover:scale-105"
                  style={{
                    transform: "translate(0, 4%) scale(1.3)",
                  }}
                  priority
                />
              </div>
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-2">
                  AI Assistant
                </Badge>
                <h3 className="text-xl font-bold">
                  Meet Briq, Your Personal Note Assistant
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Experience the power of Briq, your intelligent note companion.
                  From summarizing content and finding connections to answering
                  questions about your notes, Briq helps you get more value from
                  your knowledge base. It&apos;s like having a research
                  assistant that knows your notes inside and out.
                </p>
              </div>
            </motion.div>

            {/* Feature 4 - Note Connections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="group p-6 rounded-xl hover:bg-accent/50 transition-colors"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted border mb-6 group-hover:border-accent transition-colors">
                <Image
                  src={getImageUrl("links")}
                  alt="Smart Organization"
                  width={1200}
                  height={900}
                  className="object-cover w-full h-full transform transition-transform group-hover:scale-105"
                  priority
                  style={{ transform: "scale(1.8)" }}
                />
              </div>
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-2">
                  Dynamic Connections
                </Badge>
                <h3 className="text-xl font-bold">Connect Your Ideas</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Link related notes with a simple click. Watch as your
                  knowledge network grows naturally, revealing new insights and
                  connections you never noticed before.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section id="feature-details" className="py-24 bg-accent/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="secondary">Essential Tools</Badge>
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Powerful, Yet Simple
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-lg">
                  All the tools you need to write effectively, wrapped in a
                  clean, distraction-free design. No complexity, just smooth
                  writing experience.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Focus Mode",
                    description:
                      "Write without distractions in a clean, minimal environment",
                    icon: <Expand />,
                  },
                  {
                    title: "No Folders Needed",
                    description:
                      "Everything in one place - just write and let your ideas flow",
                    icon: <FolderX />,
                  },
                  {
                    title: "Always in Sync",
                    description: "Access your notes instantly on any device",
                    icon: <Cloud />,
                  },
                  {
                    title: "Rich Formatting",
                    description:
                      "Style your notes exactly how you want with Markdown",
                    icon: <Baseline />,
                  },
                  {
                    title: "LaTeX Support",
                    description: "Write mathematical expressions with ease",
                    icon: <Sigma />,
                  },
                  {
                    title: "Code Blocks",
                    description:
                      "Share and format code with syntax highlighting",
                    icon: <Code />,
                  },
                  {
                    title: "Quick Labels",
                    description:
                      "Add light touches of context without getting lost in organization",
                    icon: <Tag />,
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group flex items-start gap-4 p-3 rounded-lg hover:bg-background/80 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {feature.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border shadow-xl"
            >
              <Image
                src={getImageUrl("editor")}
                alt="Nebriq Editor Interface"
                fill
                className="object-cover w-full h-full"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-6">
              Early Access
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Writing, Stop Overthinking
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our early adopters and experience a simpler way to write and
              think clearly.
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
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="https://microlaunch.net/p/nebriq"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
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
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/help"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Help Center
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
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  href="mailto:hi@nebriq.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Nebriq. All rights reserved.
            </span>

            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-red-500 mx-1" />
              <span>by</span>
              <Link
                href="https://paulbg.dev"
                className="text-muted-foreground hover:text-foreground transition-colors ml-1"
              >
                Paul Bogatyr
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

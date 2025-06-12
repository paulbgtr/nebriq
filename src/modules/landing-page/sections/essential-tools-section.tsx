"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Search,
  FolderX,
  Maximize,
  Cloud,
  Type,
  Brain,
  Code,
  Tag,
} from "lucide-react";

// Memoized tool card component for better performance
const ToolCard = memo(
  ({
    title,
    description,
    icon: Icon,
    delay = 0,
    accentColor = "primary",
  }: {
    title: string;
    description: string;
    icon: React.ElementType;
    delay?: number;
    accentColor?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative"
    >
      <div className="relative h-full p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Simple accent line */}
        <div
          className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${accentColor} to-${accentColor}/60 rounded-t-xl`}
        />

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-muted/50">
          <Icon className={`w-6 h-6 text-${accentColor}`} />
        </div>

        <h3 className="mb-3 text-lg font-semibold text-foreground">{title}</h3>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  ),
);

ToolCard.displayName = "ToolCard";

export const EssentialToolsSection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.21, 0.45, 0.27, 0.99] },
  };

  const tools = [
    {
      title: "Focus Mode",
      description:
        "Distraction-free writing environment that adapts to your workflow and helps maintain deep focus.",
      icon: Maximize,
      accentColor: "primary",
    },
    {
      title: "Smart Organization",
      description:
        "No folders needed. Your notes organize themselves based on content and connections.",
      icon: FolderX,
      accentColor: "purple-500",
    },
    {
      title: "Instant Sync",
      description:
        "Real-time synchronization across all your devices with offline support.",
      icon: Cloud,
      accentColor: "blue-500",
    },
    {
      title: "Rich Formatting",
      description:
        "Beautiful typography and formatting that enhances readability without complexity.",
      icon: Type,
      accentColor: "green-500",
    },
    {
      title: "Math Support",
      description:
        "Write mathematical expressions with LaTeX support and live preview rendering.",
      icon: Brain,
      accentColor: "emerald-500",
    },
    {
      title: "Code Blocks",
      description:
        "Syntax highlighting for over 100+ programming languages with smart indentation.",
      icon: Code,
      accentColor: "yellow-500",
    },
    {
      title: "Smart Tags",
      description:
        "Automatic tagging based on content analysis helps organize and discover notes.",
      icon: Tag,
      accentColor: "pink-500",
    },
    {
      title: "Semantic Search",
      description:
        "Find notes by meaning, not just keywords. Search understands context and intent.",
      icon: Search,
      accentColor: "indigo-500",
    },
  ];

  return (
    <section className="relative py-16 sm:py-24">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/10 via-background to-muted/10" />

      <div className="relative z-10 px-4 mx-auto max-w-6xl">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-16"
        >
          {/* Section Header */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="text-center space-y-4"
          >
            {/* Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Essential Tools
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Simple Tools,
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Powerful Results
              </span>
            </h2>

            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Everything you need to write, organize, and discover your ideas.
              Clean design that gets out of your way.
            </p>
          </motion.div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <ToolCard key={tool.title} {...tool} delay={0.3 + index * 0.05} />
            ))}
          </div>

          {/* Bottom CTA Section */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.8 }}
            className="text-center pt-8"
          >
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                Ready to transform your writing?
              </h3>
              <p className="text-muted-foreground">
                Join writers who&apos;ve already discovered a better way to
                organize their thoughts.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { AlertCircle, FolderX, Brain, Sparkles } from "lucide-react";

// Memoized problem card component for better performance
const ProblemCard = memo(({ 
  title, 
  icon: Icon, 
  description, 
  delay = 0,
  accentColor = "primary"
}: {
  title: string;
  icon: React.ElementType;
  description: string;
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
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${accentColor} to-${accentColor}/60 rounded-t-xl`} />
      
      {/* Icon */}
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-muted/50">
        <Icon className={`w-6 h-6 text-${accentColor}`} />
      </div>

      <h3 className="mb-3 text-lg font-semibold text-foreground">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  </motion.div>
));

ProblemCard.displayName = "ProblemCard";

export const ProblemSection = () => {
  // Optimized animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.21, 0.45, 0.27, 0.99] }
  };

  const problems = [
    {
      title: "Mental Overhead",
      icon: AlertCircle,
      description: "Every thought requires a decision: where to put it, how to tag it, how to find it again. Your brain is busy filing, not thinking.",
      accentColor: "red-500"
    },
    {
      title: "Fragmented Knowledge",
      icon: FolderX,
      description: "Your notes exist in isolation. The connections between ideas—the most valuable part—remain trapped in your head.",
      accentColor: "blue-500"
    },
    {
      title: "Lost Context",
      icon: Brain,
      description: "Finding notes isn't enough. You need to remember why you wrote them and how they connect to your current thinking.",
      accentColor: "purple-500"
    }
  ];

  return (
    <section id="problem" className="relative py-16 sm:py-24">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />
      
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border/50">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">The Problem</span>
              </div>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center">
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Your thoughts deserve
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                better tools
              </span>
            </h2>
          </motion.div>

          {/* Main Problem Statement */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
              {/* Subtle glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl blur-xl opacity-50 -z-10" />
              
              <p className="text-lg sm:text-xl text-center leading-relaxed text-muted-foreground">
                Current note-taking tools force a choice: 
                <span className="text-red-500 font-medium"> rigid structure </span>
                or 
                <span className="text-green-500 font-medium"> chaotic freedom</span>. 
                You either spend hours organizing or lose track of what matters.
              </p>
            </div>
          </motion.div>

          {/* Problem Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((problem, index) => (
              <ProblemCard
                key={problem.title}
                {...problem}
                delay={0.5 + index * 0.1}
              />
            ))}
          </div>

          {/* Solution Preview */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background/50 to-primary/5 backdrop-blur-sm">
              {/* Enhanced glow for solution */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-2xl opacity-40 -z-10" />
              
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                    What if your notes worked like your brain?
                  </h3>

                  <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                    Nebriq lets you capture thoughts naturally. No folders. No tags. Just write. 
                    The AI works silently to connect ideas, surface relevant context, and build 
                    your personal knowledge network—exactly when you need it.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
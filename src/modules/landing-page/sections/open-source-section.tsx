"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Github,
  Users,
  Star,
  BookOpen,
  Terminal,
  Zap,
  Lock,
  Globe,
  ArrowRight,
  Coffee,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

// Memoized feature badge component
const FeatureBadge = memo(
  ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium text-primary">{text}</span>
    </div>
  ),
);

FeatureBadge.displayName = "FeatureBadge";

// Memoized benefit card component
const BenefitCard = memo(
  ({
    icon: Icon,
    title,
    description,
    delay = 0,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
    delay?: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative"
    >
      <div className="relative h-full p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-muted/50">
          <Icon className="w-6 h-6 text-primary" />
        </div>

        <h4 className="mb-3 text-lg font-semibold text-foreground">{title}</h4>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  ),
);

BenefitCard.displayName = "BenefitCard";

// Simple code block component
const CodeBlock = memo(() => (
  <div className="bg-muted/50 rounded-xl p-6 border border-border/50">
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/50">
      <Terminal className="w-4 h-4 text-green-500" />
      <span className="text-sm font-medium text-foreground">Get Started</span>
      <div className="flex gap-1 ml-auto">
        <div className="w-2 h-2 rounded-full bg-red-400" />
        <div className="w-2 h-2 rounded-full bg-yellow-400" />
        <div className="w-2 h-2 rounded-full bg-green-400" />
      </div>
    </div>
    <div className="space-y-2 font-mono text-sm">
      <div className="text-muted-foreground">
        <span className="text-green-500">$</span> git clone
        https://github.com/paulbgtr/nebriq
      </div>
      <div className="text-muted-foreground">
        <span className="text-green-500">$</span> cd nebriq
      </div>
      <div className="text-muted-foreground">
        <span className="text-green-500">$</span> bun install
      </div>
      <div className="text-muted-foreground">
        <span className="text-green-500">$</span> bun dev
      </div>
      <div className="text-primary italic text-xs mt-3">
        # Your ideas become reality ✨
      </div>
    </div>
  </div>
));

CodeBlock.displayName = "CodeBlock";

export const OpenSourceSection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.21, 0.45, 0.27, 0.99] },
  };

  const benefits = [
    {
      icon: Lock,
      title: "Your Data, Your Rules",
      description:
        "Complete transparency. No vendor lock-in. Self-host anywhere with full control over your data.",
    },
    {
      icon: Users,
      title: "Community Powered",
      description:
        "Built by developers, for developers. Every voice matters in shaping the future of note-taking.",
    },
    {
      icon: Zap,
      title: "Innovation Unleashed",
      description:
        "Rapid iteration, cutting-edge features, zero corporate bureaucracy slowing down progress.",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description:
        "Your contributions reach developers worldwide, creating lasting value for the entire community.",
    },
  ];

  const perks = [
    { icon: ArrowRight, text: "Direct influence on roadmap" },
    { icon: Star, text: "Founding member recognition" },
    { icon: Coffee, text: "1-on-1 access to core team" },
    { icon: Zap, text: "Priority feature requests" },
  ];

  return (
    <section id="open-source" className="relative py-16 sm:py-24">
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
              <FeatureBadge icon={Sparkles} text="Open Source" />
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Build the Future
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Together
              </span>
            </h2>

            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Nebriq isn&apos;t just open source—it&apos;s open opportunity.
              Join us in building the future of intelligent note-taking.
            </p>
          </motion.div>

          {/* Hero Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Code. Community. Innovation.
                </h3>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Every line of code is transparent. Every decision is
                  collaborative. Every feature serves the community first.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="group" asChild>
                  <Link
                    href="https://github.com/paulbgtr/nebriq"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    Explore Code
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <Link href="#" className="group">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Read Docs
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Right: Code Block */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              {/* Subtle glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl blur-xl opacity-50 -z-10" />
              <CodeBlock />
            </motion.div>
          </div>

          {/* Benefits Section */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.7 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Why Open Source Matters
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Transparency, collaboration, and community-driven innovation at
                the heart of everything we build.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <BenefitCard
                  key={benefit.title}
                  {...benefit}
                  delay={0.9 + index * 0.1}
                />
              ))}
            </div>
          </motion.div>

          {/* Early Pioneer CTA */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 1.3 }}
            className="relative"
          >
            <div className="relative p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background/50 to-primary/5 backdrop-blur-sm">
              {/* Enhanced glow for CTA */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-2xl opacity-40 -z-10" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-8 h-8 text-primary" />
                    <h3 className="text-2xl font-bold text-foreground">
                      Be an Early Pioneer
                    </h3>
                  </div>

                  <p className="text-base sm:text-lg text-muted-foreground">
                    Join a select group of early contributors who are shaping
                    the future of note-taking. Your ideas don&apos;t just
                    matter—they become reality.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {perks.map((perk, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <perk.icon className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground">
                          {perk.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border/50 bg-card/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Current Status
                      </span>
                      <span className="px-2 py-1 text-xs bg-green-500/20 text-green-600 dark:text-green-400 rounded-full">
                        🟢 Active Development
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Perfect time to jump in and make a real impact
                    </p>
                  </div>

                  <Button size="lg" className="w-full group" asChild>
                    <Link
                      href="https://github.com/paulbgtr/nebriq"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-5 h-5 mr-2" />
                      Start Your Journey
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

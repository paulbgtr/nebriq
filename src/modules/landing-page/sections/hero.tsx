"use client";

import React, { memo, Suspense } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Star, Github } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

// Lazy load the heavy visualization component
const KnowledgeGraphVisualization = React.lazy(() =>
  import(
    "@/modules/landing-page/features/visuals/knowledge-graph-visualization"
  ).then((module) => ({ default: module.KnowledgeGraphVisualization })),
);

// Memoized feature badge component for better performance
const FeatureBadge = memo(
  ({
    icon: Icon,
    text,
    delay = 0,
  }: {
    icon: React.ElementType;
    text: string;
    delay?: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/60 border border-border/50 backdrop-blur-sm"
    >
      <Icon className="w-3.5 h-3.5 text-primary" />
      <span className="text-xs font-medium text-muted-foreground">{text}</span>
    </motion.div>
  ),
);

FeatureBadge.displayName = "FeatureBadge";

export const HeroSection = () => {
  // Optimized animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.21, 0.45, 0.27, 0.99] },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Optimized background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />

      {/* Subtle ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center space-y-8"
        >
          {/* AI Badge */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Writing Assistant
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="block bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                Write. Ask. Know.
              </span>
            </h1>

            <motion.p
              {...fadeInUp}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed"
            >
              A minimal writing space that uses AI to organize your notes and
              make your knowledge accessible—no folders, just connections.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="group min-w-40" asChild>
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </motion.a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="group min-w-40"
              asChild
            >
              <motion.a
                href="https://github.com/paulbgtr/nebriq"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4 mr-2" />
                Star on GitHub
                <Star className="w-4 h-4 ml-2 transition-transform group-hover:scale-110" />
              </motion.a>
            </Button>
          </motion.div>

          {/* Feature Badges */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-4"
          >
            <FeatureBadge icon={Sparkles} text="AI-Powered" delay={0.9} />
            <FeatureBadge icon={ArrowRight} text="No Folders" delay={1.0} />
            <FeatureBadge icon={Star} text="Smart Connections" delay={1.1} />
          </motion.div>

          {/* Main Visualization */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 1.0 }}
            className="relative max-w-4xl mx-auto mt-16"
          >
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />

              {/* Visualization Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                        />
                        <span className="text-sm">
                          Loading visualization...
                        </span>
                      </div>
                    </div>
                  }
                >
                  <KnowledgeGraphVisualization />
                </Suspense>
              </div>

              {/* Floating UI Elements - Simplified */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute top-6 left-6 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 shadow-lg"
              >
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="font-medium">Write your thoughts</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute top-6 right-6 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 shadow-lg"
              >
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="font-medium">Ask questions</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 shadow-lg"
              >
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">Discover connections</span>
                </div>
              </motion.div>
            </div>

            {/* Subtle glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl blur-2xl opacity-50 -z-10" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

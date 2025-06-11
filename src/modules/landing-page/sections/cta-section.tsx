"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Github, BookOpen } from "lucide-react";
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

// Memoized stat card component
const StatCard = memo(
  ({
    number,
    label,
    delay = 0,
  }: {
    number: string;
    label: string;
    delay?: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
        {number}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  ),
);

StatCard.displayName = "StatCard";

export const CtaSection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.21, 0.45, 0.27, 0.99] },
  };

  return (
    <section id="cta" className="relative py-16 sm:py-24">
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
              <FeatureBadge icon={Sparkles} text="Join the Movement" />
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Ready to Transform
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Your Writing?
              </span>
            </h2>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
              Join thousands of writers who&apos;ve already discovered a better
              way to organize their thoughts. Start free, no credit card
              required.
            </p>
          </motion.div>

          {/* Main CTA */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.7 }}
            className="text-center space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="group min-w-48" asChild>
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="group min-w-48"
                asChild
              >
                <Link
                  href="https://github.com/paulbgtr/nebriq"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                </Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Free forever • No credit card required • Open source
            </p>
          </motion.div>

          {/* Features Highlight */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.9 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative p-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background/50 to-primary/5 backdrop-blur-sm">
              {/* Enhanced glow for final CTA */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-2xl opacity-40 -z-10" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-primary/10">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">AI-Powered</h3>
                  <p className="text-sm text-muted-foreground">
                    Smart organization that learns from your writing patterns
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-primary/10">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    Distraction-Free
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Clean interface that lets you focus on what matters most
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-primary/10">
                    <Github className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Open Source</h3>
                  <p className="text-sm text-muted-foreground">
                    Transparent, community-driven development you can trust
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Final message */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 1.1 }}
            className="text-center"
          >
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Ready to experience the future of note-taking? Join our community
              of writers, thinkers, and creators who are already transforming
              how they capture and connect ideas.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

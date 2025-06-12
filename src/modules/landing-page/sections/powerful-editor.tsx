"use client";

import React, { memo, Suspense } from "react";
import { motion } from "framer-motion";
import { Type, Maximize, Loader2 } from "lucide-react";

// Lazy load the heavy editor visualization component
const EditorVisualization = React.lazy(() =>
  import("@/modules/landing-page/features/visuals/editor-visualization").then(
    (module) => ({ default: module.EditorVisualization }),
  ),
);

// Loading fallback component
const EditorLoader = () => (
  <div className="flex items-center justify-center w-full h-full min-h-[400px] bg-muted/20 rounded-xl">
    <div className="flex items-center gap-3 text-muted-foreground">
      <Loader2 className="w-6 h-6 animate-spin" />
      <span className="text-sm">Loading editor...</span>
    </div>
  </div>
);

// Memoized feature badge component
const FeatureBadge = memo(
  ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium text-primary">{text}</span>
    </div>
  ),
);

FeatureBadge.displayName = "FeatureBadge";

export const PowerfulEditorSection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.21, 0.45, 0.27, 0.99] },
  };

  return (
    <section className="relative py-16 sm:py-24">
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
              <FeatureBadge icon={Type} text="Powerful Editor" />
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Write Without
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Distractions
              </span>
            </h2>

            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              A clean, powerful editor that stays out of your way. Focus on
              writing while AI works quietly in the background.
            </p>
          </motion.div>

          {/* Editor Showcase */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm shadow-2xl">
              {/* Subtle glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-2xl opacity-40 -z-10" />

              {/* Editor Visualization */}
              <div className="absolute inset-0">
                <Suspense fallback={<EditorLoader />}>
                  <EditorVisualization />
                </Suspense>
              </div>

              {/* Overlay with content */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

              {/* Bottom content */}
              <div className="absolute bottom-0 text-right right-8 p-8">
                <div className="max-w-2xl space-y-4">
                  <div className="flex justify-end">
                    <FeatureBadge icon={Maximize} text="Distraction Free" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Pure Writing Experience
                  </h3>

                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                    Clean interface, smart formatting, and seamless performance.
                    Everything you need, nothing you don&apos;t.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                title: "Minimal Interface",
                description:
                  "Clean design that puts your content first. No clutter, just focus.",
              },
              {
                title: "Smart Formatting",
                description:
                  "Intelligent text styling that adapts to your writing style and preferences.",
              },
              {
                title: "Seamless Performance",
                description:
                  "Lightning-fast response times even with large documents and complex formatting.",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center space-y-3">
                <h4 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.7 }}
            className="text-center pt-8"
          >
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                Experience the difference
              </h3>
              <p className="text-muted-foreground">
                Join writers who&apos;ve discovered the joy of distraction-free
                writing with intelligent assistance.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

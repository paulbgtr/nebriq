"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Search,
  FolderX,
  Maximize,
  Cloud,
  Type,
  Sigma,
  Code,
  Tag,
} from "lucide-react";
import { FuturisticCard } from "@/modules/landing-page/components/futuristic-card";

export const EssentialToolsSection = () => {
  return (
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
  );
};

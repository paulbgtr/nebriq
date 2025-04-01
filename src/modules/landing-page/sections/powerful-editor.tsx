"use client";

import { motion } from "framer-motion";
import { Type, Maximize } from "lucide-react";
import { EditorVisualization } from "@/modules/landing-page/features/visuals/editor-visualization";

export const PowerfulEditorSection = () => {
  return (
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
            A powerful editor that stays out of your way. Focus on writing while
            AI works in the background.
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
                    matters most - your ideas. No cluttered toolbars, just pure
                    writing bliss.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

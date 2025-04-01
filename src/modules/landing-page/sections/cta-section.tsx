"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/shared/components/ui/button";
import { Sparkles, BotMessageSquare, BookOpen, Search } from "lucide-react";
import Link from "next/link";

export const CtaSection = () => {
  return (
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
              Join us in building a simpler way to write and think. Be among the
              first to experience the future of note-taking.
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
                <Link
                  href="#hero"
                  className={buttonVariants({ variant: "default" })}
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
                </Link>
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
  );
};

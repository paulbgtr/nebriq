"use client";

import { motion } from "framer-motion";
import { Sparkles, Settings, FolderX, Compass } from "lucide-react";

export const ProblemSection = () => {
  return (
    <section id="problem" className="relative py-16 sm:py-24 mt-16 sm:mt-32">
      {/* Content */}
      <div className="relative z-10 px-6 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section header with visual indicator */}
          <div className="flex flex-col items-center mb-16">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "60px" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-px bg-gradient-to-b from-transparent via-primary/50 to-primary/80 mb-6"
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-4 border rounded-full border-primary/20 bg-background/80 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                The Reality
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-3xl font-bold text-center md:text-4xl lg:text-5xl [text-wrap:balance]"
            >
              <span className="relative">
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground">
                  Your thoughts deserve better tools
                </span>
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute bottom-2 left-0 h-[6px] bg-primary/10 -z-0"
                />
              </span>
            </motion.h2>
          </div>

          {/* Main problem statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative p-8 mb-16 overflow-hidden border rounded-xl border-primary/10 bg-background/60 backdrop-blur-md"
          >
            {/* Decorative elements */}
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
              className="absolute top-0 left-0 w-20 h-20 -translate-x-1/2 -translate-y-1/2 bg-primary/20 blur-3xl rounded-full"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: [0.4, 0.3, 0.4],
                scale: [0.98, 1.02, 0.98],
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              }}
              className="absolute bottom-0 right-0 w-20 h-20 translate-x-1/2 translate-y-1/2 bg-blue-500/20 blur-3xl rounded-full"
            />

            <div className="relative">
              <p className="text-xl leading-relaxed text-foreground/90 md:text-2xl">
                Current note-taking tools force a choice:
                <span className="relative inline-block px-1">
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                    structure
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-[6px] bg-red-500/20 -z-0" />
                </span>
                or
                <span className="relative inline-block px-1">
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-500">
                    freedom
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-[6px] bg-green-500/20 -z-0" />
                </span>
                . You either spend hours organizing or lose track of what
                matters.
              </p>
            </div>
          </motion.div>

          {/* Problem cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                title: "Mental Overhead",
                icon: Settings,
                description:
                  "Every thought requires a decision: where to put it, how to tag it, how to find it again. Your brain is busy filing, not thinking.",
                color: "from-red-500/80 to-orange-500/80",
                shadowColor: "shadow-red-500/10",
                iconBg: "bg-red-500/10",
                glowColor: "rgba(239, 68, 68, 0.3)",
              },
              {
                title: "Fragmented Knowledge",
                icon: FolderX,
                description:
                  "Your notes exist in isolation. The connections between ideas—the most valuable part—remain trapped in your head.",
                color: "from-blue-500/80 to-sky-500/80",
                shadowColor: "shadow-blue-500/10",
                iconBg: "bg-blue-500/10",
                glowColor: "rgba(59, 130, 246, 0.3)",
              },
              {
                title: "Lost Context",
                icon: Compass,
                description:
                  "Finding notes isn't enough. You need to remember why you wrote them and how they connect to your current thinking.",
                color: "from-purple-500/80 to-violet-500/80",
                shadowColor: "shadow-purple-500/10",
                iconBg: "bg-purple-500/10",
                glowColor: "rgba(124, 58, 237, 0.3)",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
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
                  style={{ backgroundColor: item.glowColor }}
                  className="absolute inset-0 transition-all duration-700 rounded-xl blur-2xl group-hover:blur-3xl opacity-20"
                />
                <div className="relative h-full p-6 overflow-hidden transition-all duration-300 border rounded-lg bg-background/60 backdrop-blur-sm border-primary/10 hover:shadow-lg hover:-translate-y-1 z-10">
                  {/* Gradient accent */}
                  <div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-80"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${item.color
                        .split(" ")[0]
                        .replace("from-", "")}, ${item.color
                        .split(" ")[1]
                        .replace("to-", "")})`,
                    }}
                  />

                  {/* Icon with background */}
                  <div className="relative w-12 h-12 flex items-center justify-center mb-4">
                    <motion.div
                      className={`absolute inset-0 rounded-full ${item.iconBg}`}
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
                    <item.icon
                      className={`w-6 h-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r ${item.color} relative z-10`}
                    />
                  </div>

                  <h3 className="mb-2 text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Solution statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="mt-16 relative group"
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
              className="absolute inset-0 transition-all duration-700 rounded-xl blur-2xl group-hover:blur-3xl opacity-20"
            />
            <div className="relative p-8 overflow-hidden border rounded-xl bg-gradient-to-br from-background/80 to-background/60 border-primary/20 backdrop-blur-md shadow-lg z-10">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 translate-x-1/2 -translate-y-1/2 bg-primary/10 blur-3xl rounded-full" />

              <div className="relative flex items-start gap-4">
                <div className="hidden md:flex flex-shrink-0 mt-1">
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
                    <Sparkles className="w-6 h-6 text-primary relative z-10" />
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80 md:text-2xl">
                    What if your notes worked like your brain?
                  </h3>

                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Nebriq lets you capture thoughts naturally. No folders. No
                    tags. Just write. The AI works silently to connect ideas,
                    surface relevant context, and build your personal knowledge
                    network—exactly when you need it.
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

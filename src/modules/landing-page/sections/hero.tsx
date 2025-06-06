"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  BotMessageSquare,
  Waypoints,
  Type,
  Sigma,
  FolderX,
} from "lucide-react";
import { KnowledgeGraphVisualization } from "@/modules/landing-page/features/visuals/knowledge-graph-visualization";
import { Star } from "lucide-react";

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative flex items-center justify-center min-h-[90vh] pt-32 pb-24 md:pb-12 lg:pb-6 overflow-hidden"
    >
      {/* Floating elements */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute rounded-full top-1/4 -left-20 w-60 h-60 bg-primary/20 blur-[100px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          className="absolute rounded-full bottom-1/4 -right-20 w-80 h-80 bg-secondary/20 blur-[100px]"
        />
        {/* Additional ambient light effects */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute rounded-full top-1/2 left-1/3 w-40 h-40 bg-blue-500/20 blur-[80px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 6, repeat: Infinity, delay: 3 }}
          className="absolute rounded-full bottom-1/3 right-1/3 w-32 h-32 bg-purple-500/20 blur-[60px]"
        />
      </div>

      {/* Futuristic grid pattern background - matching Essential Tools section */}
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

      {/* Main content */}
      <div className="relative z-10 px-4 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center space-y-16"
        >
          {/* Hero title */}
          <motion.div
            className="relative space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.21, 0.45, 0.27, 0.99],
            }}
          >
            {/* Decorative elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-4 border rounded-full border-primary/20 bg-background/80 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Writing
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground/80 relative"
                >
                  Write.
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                  />
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary/80 relative"
                >
                  Ask.
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 1.4 }}
                    className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                  />
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 relative"
                >
                  Know.
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 1.6 }}
                    className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
                  />
                </motion.span>
              </div>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed"
            >
              A simple writing space that uses AI to keep your notes organized
              and your knowledge accessible.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            >
              <motion.a
                href="/signup"
                className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden rounded-full bg-primary text-white shadow-md transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:-translate-y-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
                  Get Started
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </span>
                <motion.span
                  className="absolute top-0 left-0 w-full h-full bg-white/10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{
                    scale: 1.5,
                    opacity: 0.2,
                    transition: { duration: 0.4 },
                  }}
                />
              </motion.a>

              <motion.a
                href="https://github.com/paulbgtr/nebriq"
                className="group relative overflow-hidden rounded-full px-6 py-3 text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-4">
                  Star on Github
                  <Star className="w-5 h-5" />
                </span>
                <motion.span
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-[1px] bg-primary/30"
                  initial={{ width: 0 }}
                  whileHover={{
                    width: "80%",
                    transition: { duration: 0.3 },
                  }}
                />
              </motion.a>
            </motion.div>

            {/* Decorative line */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-primary/30 to-transparent mt-10"
            />
          </motion.div>

          {/* Feature Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            className="flex flex-wrap justify-center gap-3 px-4"
          >
            {[
              {
                icon: Sparkles,
                text: "AI-Powered",
                color: "from-blue-500/20 to-blue-600/10",
                glowColor: "rgba(59, 130, 246, 0.3)",
              },
              {
                icon: Waypoints,
                text: "Dynamic Knowledge Maps",
                color: "from-purple-500/20 to-purple-600/10",
                glowColor: "rgba(124, 58, 237, 0.3)",
              },
              {
                icon: FolderX,
                text: "No Folders",
                color: "from-green-500/20 to-green-600/10",
                glowColor: "rgba(16, 185, 129, 0.3)",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 1.2 + index * 0.1,
                  ease: "easeOut",
                }}
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
                  style={{ backgroundColor: feature.glowColor }}
                  className="absolute inset-0 transition-all duration-700 rounded-full blur-xl group-hover:blur-2xl opacity-20"
                />
                <div
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r ${feature.color} backdrop-blur-sm border border-primary/10 shadow-sm relative z-10`}
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
                    <feature.icon className="w-4 h-4 text-primary relative z-10" />
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Futuristic 3D Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="relative w-full max-w-[90vw] mx-auto mt-8"
          >
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-primary/20 shadow-xl shadow-primary/5">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 blur-2xl" />

              {/* Interactive Knowledge Graph Visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <KnowledgeGraphVisualization />
              </div>

              {/* Floating UI Elements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg bg-background/40 backdrop-blur-md border border-primary/20 shadow-lg shadow-primary/5"
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center gap-2">
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
                    <Type className="w-5 h-5 text-primary relative z-10" />
                  </div>
                  <span className="text-sm font-medium">
                    Write your thoughts
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2 p-4 rounded-lg bg-background/60 backdrop-blur-md border border-blue-400/30 shadow-lg shadow-blue-400/10"
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center gap-2">
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-blue-400/10"
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
                    <BotMessageSquare className="w-5 h-5 text-blue-400 relative z-10" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Ask questions
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
                className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 translate-y-1/2 p-4 rounded-lg bg-background/40 backdrop-blur-md border border-primary/20 shadow-lg shadow-primary/5"
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center gap-2">
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
                    <Sigma className="w-5 h-5 text-primary relative z-10" />
                  </div>
                  <span className="text-sm font-medium">
                    Discover connections
                  </span>
                </div>
              </motion.div>

              {/* Animated connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.path
                  d="M25%,25% Q50%,15% 75%,50%"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ duration: 1.5, delay: 2 }}
                  fill="none"
                  stroke="url(#lineGradient1)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
                <motion.path
                  d="M75%,50% Q60%,70% 50%,75%"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ duration: 1.5, delay: 2.2 }}
                  fill="none"
                  stroke="url(#lineGradient2)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
                <defs>
                  <linearGradient
                    id="lineGradient1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--primary)"
                      stopOpacity="0.5"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--secondary)"
                      stopOpacity="0.5"
                    />
                  </linearGradient>
                  <linearGradient
                    id="lineGradient2"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--secondary)"
                      stopOpacity="0.5"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--primary)"
                      stopOpacity="0.5"
                    />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-transparent opacity-50" />
            </div>

            {/* Subtle pulse effect at the bottom */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full bg-primary/10 blur-3xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

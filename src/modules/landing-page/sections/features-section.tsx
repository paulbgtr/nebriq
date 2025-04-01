"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  BotMessageSquare,
  StickyNote,
  Waypoints,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FaArrowUp } from "react-icons/fa";
import { KnowledgeGraphVisualization } from "@/modules/landing-page/features/visuals/knowledge-graph-visualization";
import { SemanticConnectionsVisualization } from "@/modules/landing-page/features/visuals/semantic-connections-visualization";
import { SmartLibraryVisualization } from "@/modules/landing-page/features/visuals/smart-library-visualization";

export const FeaturesOverviewSection = () => {
  return (
    <section id="features" className="relative py-24">
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
              Core Features
            </span>
          </motion.div>
          <h2 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground">
              Simple Writing, Smart Organization
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Just write. AI automatically connects and organizes your notes
            behind the scenes.
          </p>
        </div>

        <div className="space-y-24">
          {/* AI-Powered Insights */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div className="w-full md:w-3/5 relative group">
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
              <div className="relative rounded-xl overflow-hidden border border-primary/20 bg-card p-4 shadow-md backdrop-blur-sm">
                <div className="flex flex-col space-y-4 h-[300px]">
                  {/* Chat header */}
                  <div className="flex items-center justify-between pb-2 border-b border-border">
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
                        <BotMessageSquare className="w-5 h-5 text-primary relative z-10" />
                      </div>
                      <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80">
                        Chat with Briq
                      </span>
                    </div>
                  </div>

                  {/* Chat messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {/* User message */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-2 max-w-[80%] ml-auto">
                        <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none">
                          <p>
                            What are the key points from my meeting notes
                            yesterday?
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bot message with note reference */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-2 max-w-[80%]">
                        <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                          <p className="mb-2">
                            Based on your meeting notes from yesterday, here are
                            the key points:
                          </p>
                          <ul className="space-y-1 pl-4 list-disc">
                            <li>Project deadline extended to next Friday</li>
                            <li>New feature requirements added to sprint</li>
                            <li>Team agreed on weekly progress updates</li>
                          </ul>
                          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <StickyNote className="w-3 h-3" />
                            <span>From: Meeting Notes (Apr 15)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* User follow-up */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-2 max-w-[80%] ml-auto">
                        <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none">
                          <p>What were the new feature requirements?</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat input */}
                  <div className="relative">
                    <div className="flex items-center gap-2 p-2 rounded-lg border border-input bg-background">
                      <input
                        type="text"
                        className="flex-1 bg-transparent border-none outline-none text-sm"
                        placeholder="Ask about your notes..."
                        disabled
                      />
                      <Button
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        disabled
                      >
                        <FaArrowUp className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
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
                  Smart Analysis
                </span>
              </div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80">
                Chat with Your Notes
              </h3>
              <p className="text-lg text-muted-foreground">
                Ask questions about your notes in simple language and get
                immediate answers. Our AI understands the context across all
                your notes and delivers relevant insights with source
                references.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Natural language queries
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Sources linked to answers
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Cross-note understanding
                </li>
              </ul>
            </div>
          </div>

          {/* Knowledge Graph */}
          <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-12 items-center">
            <div className="w-full md:w-3/5 relative group">
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
                style={{ backgroundColor: "rgba(124, 58, 237, 0.3)" }}
                className="absolute inset-0 transition-all duration-700 rounded-xl blur-2xl group-hover:blur-3xl opacity-20"
              />
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-primary/20 bg-card backdrop-blur-sm">
                <KnowledgeGraphVisualization />
              </div>
            </div>
            <div className="w-full md:w-2/5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
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
                  <Waypoints className="w-4 h-4 text-primary relative z-10" />
                </div>
                <span className="text-sm font-medium text-primary">
                  Visual Connections
                </span>
              </div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80">
                Knowledge Graph
              </h3>
              <p className="text-lg text-muted-foreground">
                Visualize how your ideas connect. Our interactive knowledge
                graph helps you explore relationships between notes and discover
                new patterns in your thinking.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Interactive visualization
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Pattern discovery
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Relationship mapping
                </li>
              </ul>
            </div>
          </div>

          {/* Semantic Connections */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div className="w-full md:w-3/5 relative group">
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
                style={{ backgroundColor: "rgba(59, 130, 246, 0.3)" }}
                className="absolute inset-0 transition-all duration-700 rounded-xl blur-2xl group-hover:blur-3xl opacity-20"
              />
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-primary/20 bg-card backdrop-blur-sm">
                <SemanticConnectionsVisualization />
              </div>
            </div>
            <div className="w-full md:w-2/5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
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
                  <Waypoints className="w-4 h-4 text-primary relative z-10" />
                </div>
                <span className="text-sm font-medium text-primary">
                  Semantic Connections
                </span>
              </div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80">
                Discover Connections While Writing
              </h3>
              <p className="text-lg text-muted-foreground">
                Our AI automatically identifies connections between your notes
                as you write. See related content without breaking your flow,
                helping you build a more interconnected knowledge base.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Real-time connection discovery
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Content and title matching
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  One-click navigation to related notes
                </li>
              </ul>
            </div>
          </div>

          {/* Smart Library */}
          <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-12 items-center">
            <div className="w-full md:w-3/5 relative group">
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
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-primary/20 bg-card backdrop-blur-sm">
                <SmartLibraryVisualization />
              </div>
            </div>
            <div className="w-full md:w-2/5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
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
                  <BotMessageSquare className="w-4 h-4 text-primary relative z-10" />
                </div>
                <span className="text-sm font-medium text-primary">
                  Smart Library
                </span>
              </div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary/80">
                Your Notes, Automatically Organized
              </h3>
              <p className="text-lg text-muted-foreground">
                Don&apos;t worry about complex organization systems. Your notes
                are automatically categorized and easily accessible. Browse them
                naturally when you want to explore without AI assistance.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Smart categorization
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Flexible viewing options
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Quick search and filters
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

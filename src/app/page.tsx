"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Settings,
  Folders,
  BookOpen,
  Sigma,
  Baseline,
  Expand,
  Tag,
  Cloud,
  Code,
} from "lucide-react";

export default function Home() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Early Adopter Banner */}
      <div className="bg-primary/10 py-2">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-medium">
            🎉 Early Adopter Special: Get lifetime access at 50% off + unlimited
            notes on free accounts. Limited time offer!
          </p>
        </div>
      </div>

      {/* Background decorative elements remain unchanged */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="absolute top-0 -left-1/4 w-1/2 aspect-square bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 aspect-square bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className={`mt-8 text-5xl md:text-7xl tracking-wide font-bold`}>
              Write Better.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Think Clearer.
              </span>
            </h1>
            <p className="mt-8 text-xl text-muted-foreground">
              Your all-in-one writing workspace that helps you organize
              thoughts, connect ideas, and produce better content in half the
              time.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="flex flex-col items-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="min-w-[200px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <Link href="/signup">Get 50% Off Lifetime Access →</Link>
                </Button>
                <Badge variant="secondary" className="animate-pulse">
                  Early Bird Offer - Limited Spots Available
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                No credit card required • Unlimited notes on free plan • 14-day
                premium trial
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="flex flex-col items-center">
                <Settings className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm font-medium">Smart Organization</p>
              </div>
              <div className="flex flex-col items-center">
                <Folders className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm font-medium">Seamless Integration</p>
              </div>
              <div className="flex flex-col items-center">
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm font-medium">AI-Powered Insights</p>
              </div>
            </div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-20 relative"
            >
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-muted border shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <Image
                    src="/hero-image.png"
                    alt="nebriq's intuitive note-taking interface"
                    fill
                    className="object-cover rounded-xl"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Problem Statement Section */}
      <div className="relative py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="mb-6">
                The Problem
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Note-Taking Has Become{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                  Too Complex
                </span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground"
            >
              Today's note-taking tools overwhelm you with features, folders,
              and complicated workflows. They promise organization but deliver
              complexity. We believe that capturing and developing your ideas
              shouldn't require a manual.
            </motion.p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                {
                  title: "Too Many Features",
                  icon: Settings,
                  description:
                    "Endless settings, plugins, and customization options that distract from what matters - your ideas.",
                },
                {
                  title: "Complex Organization",
                  icon: Folders,
                  description:
                    "Rigid folder structures and tagging systems that require constant maintenance and reorganization.",
                },
                {
                  title: "Learning Curve",
                  icon: BookOpen,
                  description:
                    "Steep learning curves and complicated workflows that slow down your creative process.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="group"
                >
                  <div className="p-6 rounded-lg bg-background/50 border border-border/50 transition-all duration-300 hover:bg-background/80 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1">
                    <div className="text-muted-foreground/50 mb-3">
                      <item.icon className="w-6 h-6 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-16"
            >
              <div className="p-8 rounded-2xl  from-primary/10 via-secondary/5 to-primary/10 border border-primary/20 shadow-lg shadow-primary/5 backdrop-blur-sm">
                <div className="flex items-start space-x-3">
                  <span className="text-3xl text-primary/80">❝</span>
                  <p className="text-xl font-medium leading-relaxed bg-gradient-to-r from-primary via-pink-500 to-purple-500 text-transparent bg-clip-text">
                    Nebriq brings simplicity back to note-taking, letting you
                    focus on what truly matters - your thoughts and ideas.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Early Adopter Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-background to-accent/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4">
              Limited Time Offer
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Early Adopter Exclusive Benefits
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <div className="p-6 rounded-xl bg-card border">
                <div className="text-4xl font-bold text-primary mb-2">
                  50% Off
                </div>
                <h3 className="text-xl font-semibold mb-2">Lifetime Access</h3>
                <p className="text-muted-foreground">
                  Lock in our lowest price forever. Early adopters get permanent
                  access to all premium features at half the price.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border">
                <div className="text-4xl font-bold text-primary mb-2">∞</div>
                <h3 className="text-xl font-semibold mb-2">Unlimited Notes</h3>
                <p className="text-muted-foreground">
                  Free accounts get unlimited notes storage. Start organizing
                  your thoughts without restrictions.
                </p>
              </div>
            </div>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-gradient-to-r from-primary to-primary/80"
            >
              <Link href="/signup">Claim Your Early Bird Offer →</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 max-w-2xl mx-auto"
          >
            <Badge variant="secondary" className="mb-3">
              Early Bird Pricing
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">
              Choose Your Plan
            </h2>
            <p className="text-muted-foreground">
              Lock in our best prices forever as an early adopter
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <span
                className={`text-sm transition-colors duration-300 ${
                  !isYearly
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Monthly
              </span>
              <Button
                variant="outline"
                size="sm"
                className="relative"
                onClick={() => setIsYearly(!isYearly)}
              >
                <div
                  className={`w-8 h-4 bg-muted rounded-full p-0.5 transition-all duration-300 ${
                    isYearly ? "bg-primary" : ""
                  }`}
                >
                  <div
                    className={`w-3 h-3 bg-white rounded-full transition-all duration-300 ${
                      isYearly ? "translate-x-4" : ""
                    }`}
                  />
                </div>
              </Button>
              <span
                className={`text-sm transition-colors duration-300 ${
                  isYearly
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                Yearly (Save 20%)
              </span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl p-6 bg-card border hover:border-primary/50 transition-colors"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-1">Free</h3>
                <p className="text-muted-foreground">Perfect to get started</p>
                <div className="mt-3 relative h-24">
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${
                      isYearly ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/year</span>
                  </div>
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${
                      !isYearly
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Unlimited notes (Early Bird Special)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Basic formatting</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Basic search</span>
                </li>
              </ul>
              <Button asChild className="w-full" variant="outline">
                <Link href="/signup">Get Started</Link>
              </Button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-2xl p-6 bg-primary/5 border border-primary relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm rounded-bl-lg">
                Early Bird Offer
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-1">Pro</h3>
                <p className="text-muted-foreground">For power users</p>
                <div className="mt-3 relative h-24">
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${
                      isYearly ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <span className="text-4xl font-bold">$96</span>
                    <span className="text-muted-foreground">/year</span>
                    <div className="text-sm text-primary mt-1">
                      Only $8/month (Save 20%)
                    </div>
                  </div>
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${
                      !isYearly
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <span className="text-4xl font-bold">$12</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <div className="mt-2 inline-block bg-primary/10 text-primary text-sm px-2 py-1 rounded transition-opacity duration-300">
                  50% off forever for early adopters
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>AI-powered summary</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Advanced formatting with LaTeX</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>AI-powered insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Advanced search & filters</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-primary to-primary/80"
              >
                <Link href="/signup">Get 50% Off Forever →</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold">Your Intellectual Ecosystem</h2>
            <p className="mt-4 text-muted-foreground">
              Precision tools designed to amplify your cognitive potential and
              research workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Feature 1 - AI Summary & Semantic Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group p-6 rounded-xl hover:bg-accent/50 transition-colors"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted border mb-6 group-hover:border-accent transition-colors">
                <Image
                  src="/intelligent-search.png"
                  alt="AI-Powered Insights"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full transform transition-transform group-hover:scale-105"
                  priority
                />
              </div>
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-2">
                  AI-Powered
                </Badge>
                <h3 className="text-xl font-bold">
                  Intelligent Semantic Search
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find exactly what you need with context-aware search that
                  understands the meaning behind your queries. Go beyond simple
                  keyword matching to discover relevant content across your
                  notes.
                </p>
              </div>
            </motion.div>

            {/* Feature 2 - Graph View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group p-6 rounded-xl hover:bg-accent/50 transition-colors"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted border mb-6 group-hover:border-accent transition-colors">
                <Image
                  src="/graph.png"
                  alt="Knowledge Graph"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full transform transition-transform group-hover:scale-105"
                  priority
                />
              </div>
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-2">
                  Interactive
                </Badge>
                <h3 className="text-xl font-bold">
                  Interactive Knowledge Graph
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Visualize connections between your notes in an interactive
                  graph view, revealing hidden relationships and patterns in
                  your knowledge network.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 - AI Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group p-6 rounded-xl hover:bg-accent/50 transition-colors"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted border mb-6 group-hover:border-accent transition-colors">
                <Image
                  src="/links.png"
                  alt="AI Summary"
                  width={1200}
                  height={900}
                  className="object-cover w-full h-full transform transition-transform group-hover:scale-105"
                  priority
                  style={{ transform: "scale(1.8)" }}
                />
              </div>
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-2">
                  Smart Analysis
                </Badge>
                <h3 className="text-xl font-bold">AI-Powered Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Transform lengthy notes into clear, concise summaries with our
                  AI. Get the essence of your content instantly while preserving
                  key insights and ideas.
                </p>
              </div>
            </motion.div>

            {/* Feature 4 - Note Connections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="group p-6 rounded-xl hover:bg-accent/50 transition-colors"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted border mb-6 group-hover:border-accent transition-colors">
                <Image
                  src="/links.png"
                  alt="Smart Organization"
                  width={1200}
                  height={900}
                  className="object-cover w-full h-full transform transition-transform group-hover:scale-105"
                  priority
                  style={{ transform: "scale(1.8)" }}
                />
              </div>
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-2">
                  Dynamic Connections
                </Badge>
                <h3 className="text-xl font-bold">Dynamic Note Connections</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create meaningful connections between your notes with our
                  intuitive linking system. Build a rich, interconnected
                  knowledge base that grows with your understanding.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="py-24 bg-accent/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="secondary" className="text-sm">
                  Features
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Craft Without Constraints
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-lg">
                  We&apos;ve engineered Nebriq to respect your intellectual
                  flow. Our minimalist design meets powerful functionality,
                  letting your creativity breathe without technological
                  friction.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "LaTeX Support",
                    description:
                      "Advanced LaTeX support for mathematical expressions",
                    icon: <Sigma />,
                  },
                  {
                    title: "Rich Formatting",
                    description:
                      "Rich Markdown formatting for beautiful documents",
                    icon: <Baseline />,
                  },
                  {
                    title: "Code Highlighting",
                    description:
                      "Syntax highlighting for over 100 programming languages",
                    icon: <Code />,
                  },
                  {
                    title: "Smart Organization",
                    description:
                      "Customizable tagging system for better organization",
                    icon: <Tag />,
                  },
                  {
                    title: "Focus Mode",
                    description: "Distraction-free writing environment",
                    icon: <Expand />,
                  },
                  {
                    title: "Always in Sync",
                    description:
                      "Real-time cloud synchronization across devices",
                    icon: <Cloud />,
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group flex items-start gap-4 p-3 rounded-lg hover:bg-background/80 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {feature.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border shadow-xl"
            >
              <Image
                src="/editor.png"
                alt="Nebriq Editor Interface"
                fill
                className="object-cover w-full h-full"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Begin Your Nebriq Journey Today
            </h2>
            <p className="text-primary-foreground/80 mb-12 max-w-xl mx-auto">
              Join the community of scholars, researchers, and visionaries who
              are using Nebriq to reimagine how brilliant ideas are born,
              nurtured, and transformed.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/signup">Experience Nebriq</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground"> 2024 nebriq</span>
            <div className="space-x-6">
              <Link
                href="https://x.com/paulbgtr"
                className="text-muted-foreground hover:text-foreground"
              >
                Twitter
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

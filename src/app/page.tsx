"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  Search,
  Twitter,
  Heart,
  Settings,
  Text,
  Mail,
  Waypoints,
  BrainCircuit,
  Maximize,
  Cloud,
  StickyNote,
  Sigma,
  Code,
  Compass,
  BookOpen,
  ChevronRight,
  Grid2X2,
  FolderIcon,
  ScrollText,
  RouteOff,
  SearchX,
  User,
  ArrowUp,
  BotMessageSquare,
} from "lucide-react";
import { ModeToggle } from "@/modules/landing-page/features/theme-switcher";
import { useTheme } from "next-themes";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/shared/components/ui/form";
import { useToast } from "@/shared/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/shared/lib/supabase/client";
import { sendEmail } from "./actions/emails/send-email";
import { Separator } from "@/shared/components/ui/separator";
import { extractFirstName } from "@/shared/lib/utils";
import { EmailTemplate } from "@/enums/email-template";
import { FuturisticCard } from "@/modules/landing-page/components/futuristic-card";
import { NeuralNetwork } from "@/modules/landing-page/features/neural-network";
import { FaArrowUp } from "react-icons/fa";
import * as d3 from "d3";
import { cn } from "@/shared/lib/utils";

const wishListSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email is too long")
    .trim()
    .toLowerCase(),
});

const imagePaths = {
  hero: {
    light: "/hero-image.png",
    dark: "/hero-image-dark.png",
  },
  intelligentSearch: {
    light: "/intelligent-search.png",
    dark: "/intelligent-search-dark.png",
  },
  graph: {
    light: "/graph.png",
    dark: "/graph-dark.png",
  },
  links: {
    light: "/links.png",
    dark: "/links-dark.png",
  },
  briq: {
    light: "/briq.png",
    dark: "/briq-dark.png",
  },
  editor: {
    light: "/editor.png",
    dark: "/editor-dark.png",
  },
};

// Add these interfaces before the DemoGraph component
interface DemoNode extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  connections: number;
}

interface DemoLink extends d3.SimulationLinkDatum<DemoNode> {
  source: DemoNode;
  target: DemoNode;
}

const DemoGraph = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Demo data
  const nodes: DemoNode[] = [
    { id: "1", title: "Machine Learning", connections: 4 },
    { id: "2", title: "Neural Networks", connections: 3 },
    { id: "3", title: "Deep Learning", connections: 3 },
    { id: "4", title: "Data Science", connections: 2 },
    { id: "5", title: "AI Ethics", connections: 2 },
    { id: "6", title: "Computer Vision", connections: 1 },
  ];

  const links: DemoLink[] = [
    { source: nodes[0], target: nodes[1] },
    { source: nodes[0], target: nodes[2] },
    { source: nodes[0], target: nodes[3] },
    { source: nodes[1], target: nodes[2] },
    { source: nodes[1], target: nodes[5] },
    { source: nodes[2], target: nodes[4] },
    { source: nodes[3], target: nodes[4] },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create the simulation
    const simulation = d3
      .forceSimulation<DemoNode>(nodes)
      .force("charge", d3.forceManyBody<DemoNode>().strength(-100))
      .force(
        "center",
        d3.forceCenter<DemoNode>(dimensions.width / 2, dimensions.height / 2)
      )
      .force(
        "link",
        d3
          .forceLink<DemoNode, DemoLink>(links)
          .id((d) => d.id)
          .distance(80)
      )
      .force(
        "collision",
        d3.forceCollide<DemoNode>().radius((d) => getNodeRadius(d) + 10)
      );

    // Create gradient definitions
    const defs = svg.append("defs");

    // Link gradient
    const linkGradient = defs
      .append("linearGradient")
      .attr("id", "demo-link-gradient")
      .attr("gradientUnits", "userSpaceOnUse");

    linkGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "hsl(var(--primary) / 0.7)");

    linkGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "hsl(var(--secondary) / 0.7)");

    // Node glow filter
    const filter = defs
      .append("filter")
      .attr("id", "demo-glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Create the link lines
    const link = svg
      .append("g")
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("stroke", "url(#demo-link-gradient)")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)
      .attr("fill", "none")
      .style("stroke-dasharray", "4,2");

    // Create node groups
    const node = svg.append("g").selectAll("g").data(nodes).join("g");

    // Add glow circles
    node
      .append("circle")
      .attr("r", (d) => getNodeRadius(d) * 2.5)
      .style("fill", "hsl(var(--primary) / 0.2)")
      .style("opacity", 0.4)
      .style("filter", "url(#demo-glow)");

    // Add main circles
    node
      .append("circle")
      .attr("r", (d) => getNodeRadius(d))
      .style("fill", "hsl(var(--primary))")
      .style("stroke", "hsl(var(--background))")
      .style("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", getNodeRadius(d) * 1.2)
          .style("fill", "hsl(var(--primary) / 0.8)");
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", getNodeRadius(d))
          .style("fill", "hsl(var(--primary))");
      });

    // Add labels
    node
      .append("text")
      .text((d) => d.title)
      .attr("x", (d) => getNodeRadius(d) + 8)
      .attr("y", 4)
      .style("font-size", "11px")
      .style("font-weight", "500")
      .style("fill", "hsl(var(--foreground))")
      .style(
        "text-shadow",
        "0 0 3px hsl(var(--background)), 0 0 3px hsl(var(--background))"
      );

    // Helper function for node radius
    function getNodeRadius(d: DemoNode) {
      const baseSize = 6;
      const connectionBonus = Math.min(d.connections || 0, 10) * 0.8;
      return baseSize + connectionBonus;
    }

    // Helper function for curved links
    function linkArc(d: DemoLink) {
      const dx = d.target.x! - d.source.x!;
      const dy = d.target.y! - d.source.y!;
      const dr = Math.sqrt(dx * dx + dy * dy) * 1.2;
      return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
    }

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link.attr("d", linkArc);
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Add subtle animation to links
    function animateLinks() {
      link
        .style("stroke-dashoffset", 8)
        .transition()
        .duration(30000)
        .ease(d3.easeLinear)
        .style("stroke-dashoffset", 0)
        .on("end", animateLinks);
    }

    animateLinks();

    return () => {
      simulation.stop();
    };
  }, [dimensions]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
    </div>
  );
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const { theme, systemTheme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getImageUrl = (imageKey: keyof typeof imagePaths) => {
    if (!mounted) return imagePaths[imageKey].light;

    const currentTheme = theme === "system" ? systemTheme : theme;
    return currentTheme === "dark"
      ? imagePaths[imageKey].dark
      : imagePaths[imageKey].light;
  };

  const form = useForm<z.infer<typeof wishListSchema>>({
    resolver: zodResolver(wishListSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof wishListSchema>) => {
    setIsSubmitting(true);

    try {
      const client = createClient();

      const { email } = values;

      const { error } = await client.from("wishlist").insert({
        email,
      });

      if (error) {
        throw new Error(error.message);
      }

      await sendEmail(
        "You're on our wish list!",
        "waitlist@nebriq.com",
        email,
        EmailTemplate.WAITLIST,
        {
          firstName: extractFirstName(email),
        }
      );

      form.reset();

      toast({
        title: "Added to wish list",
        description: "You will receive updates soon.",
      });
    } catch (e) {
      const errorDescription = (e as Error).message.includes(
        "duplicate key value violates unique constraint"
      )
        ? "Your email is already on our wish list."
        : "Something went wrong. Please try again.";

      toast({
        variant: "destructive",
        title: "Adding to wish list failed",
        description: errorDescription,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToHero = () => {
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const motionConfig = {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <div className="flex flex-col min-h-screen">
      {mounted && (
        <motion.div
          {...motionConfig}
          className="fixed top-4 sm:top-6 inset-x-0 z-50 px-2 sm:px-4"
        >
          <div className="max-w-7xl mx-auto flex justify-center">
            <div className="relative flex items-center gap-2 sm:gap-4 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border bg-background/80 backdrop-blur-md border-primary/20 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
              {/* Logo */}
              <div className="flex items-center gap-2 sm:gap-3 pr-2 sm:pr-4 border-r border-border/60">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="relative w-7 h-7 sm:w-9 sm:h-9">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 via-primary/10 to-primary/5 blur-sm" />
                    <div className="relative flex items-center justify-center w-full h-full rounded-full border border-primary/20 bg-background/50">
                      <Compass
                        className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <span className="text-base sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/80">
                    Nebriq
                  </span>
                </div>
              </div>

              {/* Beta Badge */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-primary/[0.08] border border-primary/10">
                  <span className="relative flex w-1.5 sm:w-2 h-1.5 sm:h-2">
                    <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary/40"></span>
                    <span className="relative inline-flex w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-primary"></span>
                  </span>
                  <span className="text-[10px] sm:text-xs font-medium text-primary">
                    BETA
                  </span>
                </div>
              </div>

              {/* Center Links */}
              <div className="hidden sm:flex items-center gap-6 px-4">
                <Link
                  href="/signup"
                  className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                >
                  Create Account
                </Link>
                <div className="w-px h-4 bg-border/60" />
                <Link
                  href="/login"
                  className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
                >
                  Sign in
                </Link>
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center">
                <div className="w-px h-4 bg-border/60 mr-4 hidden sm:block" />
                <ModeToggle />
              </div>

              {/* Mobile Menu (only shows login/signup) */}
              <div className="sm:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2 text-muted-foreground"
                  asChild
                >
                  <Link href="/login">
                    <span className="sr-only">Menu</span>
                    Sign in
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <NeuralNetwork />

          <div className="absolute inset-0 bg-gradient-radial from-background/70 via-background/50 to-transparent" />
        </div>

        {/* Hero Section */}
        <section
          id="hero"
          ref={heroRef}
          className="relative min-h-screen pt-24 sm:pt-32 pb-12 sm:pb-16 overflow-hidden"
        >
          {/* Enhanced Floating Elements */}
          <div className="absolute inset-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.15, 0.35, 0.15] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute rounded-full top-1/4 -left-20 w-48 sm:w-72 h-48 sm:h-72 bg-primary/30 blur-[120px]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 7, repeat: Infinity, delay: 1 }}
              className="absolute rounded-full bottom-1/4 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-secondary/30 blur-[120px]"
            />
            {/* Additional floating element */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
              className="absolute rounded-full top-2/3 left-1/3 w-40 sm:w-56 h-40 sm:h-56 bg-accent/20 blur-[100px]"
            />
            {/* Subtle animated pattern overlay */}
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.02]"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 100,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          {/* Centered Text Content */}
          <div className="relative z-10 px-4 mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center space-y-6 sm:space-y-8"
            >
              {/* Hero Title */}
              <motion.div
                className="relative space-y-4 sm:space-y-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.21, 0.45, 0.27, 0.99],
                }}
              >
                <div className="relative">
                  {/* Enhanced vibrant background glow with primary colors */}
                  <motion.div
                    className="absolute -inset-12 bg-gradient-to-br from-primary/30 via-primary/10 to-secondary/20 blur-3xl opacity-60"
                    animate={{
                      opacity: [0.4, 0.6, 0.4],
                      rotate: [0, 1, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 sm:mb-5 md:mb-7">
                      <motion.span
                        className="inline-block bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary/95 to-secondary drop-shadow-[0_2px_12px_rgba(147,197,253,0.5)] [text-shadow:0_4px_14px_rgba(0,0,0,0.25)]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      >
                        Write
                      </motion.span>
                      <motion.span
                        className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/95 to-secondary/90 drop-shadow-[0_2px_10px_rgba(167,139,250,0.5)]"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        •
                      </motion.span>
                      <motion.div className="relative inline-block">
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-br from-secondary/40 via-accent/40 to-primary/40 blur-[30px]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.5, 0.9, 0.5] }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        />
                        <motion.span
                          className="relative inline-block bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary/95 to-secondary drop-shadow-[0_2px_12px_rgba(147,197,253,0.5)] [text-shadow:0_4px_14px_rgba(0,0,0,0.25)]"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                        >
                          Ask
                        </motion.span>
                      </motion.div>
                      <motion.span
                        className="inline-block text-primary/60"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.6, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                      >
                        •
                      </motion.span>
                      <motion.div className="relative inline-block">
                        <motion.span
                          className="absolute inset-0 bg-secondary/20 blur-3xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.3, 0.5, 0.3] }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 1,
                          }}
                        />
                        <motion.span
                          className="relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/95 to-secondary drop-shadow-[0_2px_12px_rgba(147,197,253,0.5)]"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.7 }}
                        >
                          Know
                        </motion.span>
                      </motion.div>
                    </div>
                  </h1>
                </div>
                <p className="max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-muted-foreground/90 [text-wrap:balance] bg-clip-text font-medium">
                  Transform your scattered thoughts into a living knowledge base
                  that{" "}
                  <span className="text-primary/90">
                    answers your questions instantly
                  </span>
                  .
                </p>
              </motion.div>

              {/* Enhanced CTA Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="max-w-xl mx-auto px-2 sm:px-0"
              >
                <div className="relative group">
                  <div className="absolute transition-all duration-500 rounded-lg -inset-1.5 bg-gradient-to-r from-primary/60 via-primary/40 to-primary/60 blur-lg group-hover:blur-xl opacity-80 group-hover:opacity-100" />
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="relative flex flex-col sm:flex-row gap-3 sm:gap-4 p-2.5 rounded-lg bg-background/80 backdrop-blur-sm"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="Enter your email"
                                className="h-12 sm:h-14 bg-transparent border-primary/30 text-base"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 sm:h-14 px-6 sm:px-10 transition-all duration-300 bg-primary/90 hover:bg-primary text-base font-medium hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Join Waitlist
                      </Button>
                    </form>
                  </Form>
                </div>
              </motion.div>

              {/* Enhanced Feature Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap justify-center gap-3 sm:gap-4 px-2 sm:px-4"
              >
                {[
                  {
                    icon: Sparkles,
                    text: "AI-Powered Writing",
                    color: "from-blue-500/20 to-blue-600/20",
                  },
                  {
                    icon: Waypoints,
                    text: "Dynamic Knowledge Maps",
                    color: "from-purple-500/20 to-purple-600/20",
                  },
                  {
                    icon: BrainCircuit,
                    text: "Intelligent Conversations",
                    color: "from-green-500/20 to-green-600/20",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 1 + index * 0.1,
                      ease: "easeOut",
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={`flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r ${feature.color} backdrop-blur-sm border border-primary/20 shadow-sm`}
                  >
                    <feature.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    <span className="text-xs sm:text-sm font-medium">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced Interactive Chat Demo Section */}
          <div className="relative z-10 w-full mt-10 sm:mt-14 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 80,
                  delay: 1.2,
                }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 30px 60px rgba(var(--primary-rgb), 0.2)",
                  transition: {
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                  },
                }}
                className="relative rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10 bg-background/90 backdrop-blur-md"
              >
                {/* Enhanced background effects */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-primary/15 via-primary/10 to-secondary/15 blur-2xl opacity-80"
                  animate={{
                    opacity: [0.5, 0.7, 0.5],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Enhanced subtle pattern overlay */}
                <motion.div
                  className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.02]"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 120,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Chat Interface Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-primary/10 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground/70">
                    Nebriq Assistant
                  </div>
                  <div className="w-16"></div>
                </div>

                {/* Simple Chat Interface */}
                <div className="p-6 sm:p-8">
                  {/* Animated Conversation */}
                  <div className="space-y-4 mb-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 }}
                      className="flex justify-end"
                    >
                      <div className="max-w-[80%] bg-primary/10 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-foreground/90 shadow-sm">
                        What are the key insights from my research notes about
                        learning techniques?
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.2 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[80%] relative">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 2.4 }}
                          className="absolute -top-3 left-0 flex items-center gap-1.5 px-2 py-0.5 text-[10px] rounded-full bg-secondary/15 border border-secondary/30 shadow-sm"
                        >
                          <StickyNote className="w-3 h-3 text-secondary/80" />
                          <span className="text-secondary/90 font-medium">
                            From 3 notes
                          </span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 2.6 }}
                          className="prose prose-sm prose-neutral dark:prose-invert mt-2"
                        >
                          Based on your notes, here are the key learning
                          techniques:
                          <motion.ul
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 3 }}
                            className="mt-1 space-y-1"
                          >
                            <motion.li
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 3.2 }}
                            >
                              <span className="text-primary font-medium">
                                Active Recall:
                              </span>{" "}
                              Testing yourself rather than passive re-reading
                            </motion.li>
                            <motion.li
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 3.4 }}
                            >
                              <span className="text-primary font-medium">
                                Spaced Repetition:
                              </span>{" "}
                              Reviewing at optimal intervals
                            </motion.li>
                            <motion.li
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 3.6 }}
                            >
                              <span className="text-primary font-medium">
                                Elaborative Rehearsal:
                              </span>{" "}
                              Connecting new info to existing knowledge
                            </motion.li>
                          </motion.ul>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Enhanced Input Area */}
                  <div className="relative rounded-2xl border border-border/40 bg-background/95 backdrop-blur-xl overflow-hidden shadow-sm">
                    <div className="flex items-center">
                      <motion.div
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="flex-1 px-4 py-3.5 text-base leading-relaxed resize-none border-0 bg-transparent text-muted-foreground/70"
                      >
                        Ask anything about your notes...
                      </motion.div>
                      <div className="flex items-center gap-2 px-4">
                        <motion.div
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0 0 15px rgba(var(--primary-rgb), 0.5)",
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="w-9 h-9 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-md shadow-primary/20"
                        >
                          <ArrowUp className="w-3.5 h-3.5 text-primary-foreground" />
                        </motion.div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/20 bg-muted/30 px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{
                            scale: 1.02,
                            backgroundColor: "rgba(var(--primary-rgb), 0.1)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium text-muted-foreground/80 hover:text-muted-foreground hover:bg-muted/60 transition-colors duration-200"
                        >
                          <StickyNote className="w-3.5 h-3.5" />
                          <span>Add context</span>
                        </motion.button>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{
                            scale: 1.02,
                            backgroundColor: "rgba(var(--primary-rgb), 0.1)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium text-muted-foreground/80 hover:text-muted-foreground hover:bg-muted/60 transition-colors duration-200"
                        >
                          <BrainCircuit className="w-3.5 h-3.5" />
                          <span>GPT-4</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem Statement Section */}
        <section
          id="problem"
          className="relative py-24 sm:py-32 md:py-40 mt-16 sm:mt-20 md:mt-36"
        >
          {/* Enhanced Background elements */}
          <div className="absolute inset-0 bg-background/30 backdrop-blur-[3px]" />

          {/* Enhanced floating gradient orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute rounded-full top-1/3 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-primary/30 blur-[120px]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.08, 0.15, 0.08] }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
              className="absolute rounded-full bottom-1/3 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-secondary/30 blur-[120px]"
            />
            {/* Additional floating element */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.05, 0.12, 0.05] }}
              transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
              className="absolute rounded-full top-2/3 left-1/3 w-56 sm:w-72 h-56 sm:h-72 bg-accent/20 blur-[100px]"
            />
          </div>

          {/* Enhanced Subtle pattern overlay */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.02]"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 100,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Rest of the content with relative positioning */}
          <div className="relative z-10 px-4 sm:px-6 mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center space-y-8 sm:space-y-10"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 border rounded-full border-primary/30 bg-background/80 backdrop-blur-sm shadow-sm">
                  <Settings className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    The Challenge
                  </span>
                </div>

                {/* Enhanced title with animated gradient background */}
                <div className="relative">
                  <motion.div
                    className="absolute -inset-10 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 blur-3xl opacity-40"
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                      rotate: [0, 1, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <h2 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold [text-wrap:balance] bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/80">
                    Knowledge Is <span className="text-primary">Trapped</span>{" "}
                    in Your Notes
                  </h2>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl leading-relaxed text-muted-foreground/90 max-w-prose mx-auto"
              >
                Traditional note apps leave your knowledge buried and
                disconnected. Nebriq turns your notes into a{" "}
                <span className="font-medium text-foreground">
                  living knowledge base
                </span>{" "}
                you can ask questions and get immediate answers from.
              </motion.p>

              {/* Enhanced challenge cards */}
              <div className="grid grid-cols-1 gap-5 sm:gap-7 md:gap-8 mt-10 sm:mt-14 text-left md:grid-cols-3">
                {[
                  {
                    title: "Lost Information",
                    icon: SearchX,
                    description:
                      "Important insights get buried in endless notes, making it difficult to find what you need when you need it.",
                    color: "from-blue-500/20 to-blue-600/10",
                    iconBg: "bg-blue-500/15",
                    iconColor: "text-blue-500",
                  },
                  {
                    title: "Disconnected Knowledge",
                    icon: RouteOff,
                    description:
                      "Your notes contain valuable connections and patterns that remain hidden without a way to surface them.",
                    color: "from-purple-500/20 to-purple-600/10",
                    iconBg: "bg-purple-500/15",
                    iconColor: "text-purple-500",
                  },
                  {
                    title: "Static Content",
                    icon: ScrollText,
                    description:
                      "Traditional notes are passive storage - you write once and struggle to extract insights later.",
                    color: "from-green-500/20 to-green-600/10",
                    iconBg: "bg-green-500/15",
                    iconColor: "text-green-500",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="group"
                  >
                    <div className="p-5 sm:p-7 transition-all duration-300 border rounded-xl bg-background/60 border-border/50 hover:bg-background/90 hover:border-primary/30 hover:shadow-lg relative overflow-hidden">
                      {/* Enhanced gradient background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      />

                      {/* Animated shine effect on hover */}
                      <motion.div
                        initial={{ opacity: 0, x: "-100%" }}
                        whileHover={{
                          opacity: [0, 0.4, 0],
                          x: ["-100%", "100%", "100%"],
                          transition: { duration: 1.5, ease: "easeInOut" },
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                      />

                      <div className="relative z-10">
                        <div
                          className={`mb-4 flex items-center justify-center w-10 h-10 rounded-full ${item.iconBg} ${item.iconColor}`}
                        >
                          <item.icon className="w-5 h-5 transition-all group-hover:scale-110" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold transition-colors group-hover:text-primary">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-base text-muted-foreground/90 group-hover:text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced quote section */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-14 sm:mt-20"
              >
                <div className="p-6 sm:p-10 border shadow-xl rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/15 via-secondary/10 to-primary/15 border-primary/30 shadow-primary/10 backdrop-blur-sm relative overflow-hidden">
                  {/* Enhanced shine effect */}
                  <motion.div
                    initial={{ opacity: 0, x: "-100%" }}
                    animate={{
                      opacity: [0, 0.6, 0],
                      x: ["100%", "100%", "300%"],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 7,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12"
                  />

                  {/* Subtle animated background pattern */}
                  <motion.div
                    className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03]"
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                      duration: 50,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  <div className="flex items-start text-left space-x-4 relative z-10">
                    <span className="text-3xl sm:text-4xl text-primary">❝</span>
                    <div>
                      <p className="text-lg sm:text-xl md:text-2xl font-medium leading-relaxed text-transparent bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text">
                        Nebriq transforms how you interact with your knowledge.
                        Write once, ask questions anytime, and get immediate
                        answers from your notes.
                      </p>
                      <div className="mt-4 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Paul Bogatyr</p>
                          <p className="text-xs text-muted-foreground">
                            Founder, Nebriq
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section
          id="features-overview"
          className="relative py-24 sm:py-32 md:py-40"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

          {/* Add consistent background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute rounded-full top-1/3 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-primary/30 blur-[120px]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.08, 0.15, 0.08] }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
              className="absolute rounded-full bottom-1/3 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-secondary/30 blur-[120px]"
            />
          </div>

          <div className="relative z-10 px-4 sm:px-6 mx-auto max-w-7xl">
            <div className="mb-16 sm:mb-20 text-center space-y-6 sm:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Key Features
                </span>
              </motion.div>
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                  Powerful, Yet Beautifully Simple
                </h2>
                <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
                  Forget about complex folder structures and manual
                  organization. Our AI-powered features work silently in the
                  background while you focus on writing.
                </p>
              </div>
            </div>

            <div className="space-y-16 sm:space-y-20 md:space-y-24">
              {/* AI-Powered Insights */}
              <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-12 items-center">
                <div className="w-full md:w-3/5">
                  <div className="relative aspect-[16/9] rounded-lg sm:rounded-xl overflow-hidden border border-primary/20 bg-background/90 backdrop-blur-sm">
                    {/* Chat Interface Preview */}
                    <div className="absolute inset-0 flex flex-col">
                      {/* Chat Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10">
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <BrainCircuit
                              className="w-4 h-4 text-primary/70"
                              strokeWidth={1.5}
                            />
                            <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
                          </div>
                          <div className="text-sm font-medium text-foreground/80">
                            Briq
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="max-w-[75%] bg-muted/30 rounded-2xl rounded-tr-sm px-4 py-2 text-sm">
                            What are the key concepts in my machine learning
                            notes?
                          </div>
                        </div>

                        {/* Assistant Message */}
                        <div className="flex justify-start">
                          <div className="max-w-[75%] relative">
                            {/* Source Reference */}
                            <div className="absolute -top-4 left-0">
                              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/10 border border-secondary/20">
                                <StickyNote className="w-3 h-3 text-secondary-foreground/70" />
                                <span className="text-xs font-medium text-secondary-foreground/70">
                                  Source
                                </span>
                              </div>
                            </div>
                            <div className="prose prose-sm mt-2 text-foreground/90">
                              Based on your notes, the key concepts include:
                              <ul className="mt-2">
                                <li>Neural Networks & Deep Learning</li>
                                <li>Supervised vs Unsupervised Learning</li>
                                <li>Model Evaluation Metrics</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Input Area */}
                      <div className="p-4 border-t border-primary/10">
                        <div className="relative rounded-2xl border border-border/30 bg-background/95 backdrop-blur-xl overflow-hidden">
                          <div className="flex items-center">
                            <div className="flex-1 px-4 py-3 text-sm text-muted-foreground/60">
                              Message Briq...
                            </div>
                            <div className="px-4">
                              <div className="w-8 h-8 rounded-full bg-muted/40 flex items-center justify-center">
                                <FaArrowUp className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-2/5 space-y-4 sm:space-y-6 mt-4 md:mt-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Smart Analysis
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    Chat with Your Notes
                  </h3>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    Ask questions about your notes in simple language and get
                    immediate answers. Our AI understands the context across all
                    your notes and delivers relevant insights with source
                    references.
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Natural language queries
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Sources linked to answers
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Cross-note understanding
                    </li>
                  </ul>
                </div>
              </div>

              {/* Knowledge Graph */}
              <div className="flex flex-col md:flex-row-reverse gap-6 sm:gap-8 md:gap-12 items-center">
                <div className="w-full md:w-3/5">
                  <div className="relative aspect-[16/9] rounded-lg sm:rounded-xl overflow-hidden border border-primary/20 bg-background/90 backdrop-blur-sm">
                    {/* Dynamic Graph Preview */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="absolute inset-0"
                    >
                      <DemoGraph />
                    </motion.div>
                  </div>
                </div>
                <div className="w-full md:w-2/5 space-y-4 sm:space-y-6 mt-4 md:mt-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <Waypoints className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Visual Connections
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    Connected Knowledge
                  </h3>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    Visualize how your ideas connect with our interactive
                    knowledge graph. The AI automatically links related notes,
                    making it easy to explore relationships and discover hidden
                    patterns in your thinking.
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Automatic connections
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Visual exploration
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Contextual navigation
                    </li>
                  </ul>
                </div>
              </div>

              {/* Smart Library */}
              <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-12 items-center">
                <div className="w-full md:w-3/5">
                  <div className="relative aspect-[16/9] rounded-lg sm:rounded-xl overflow-hidden border border-primary/20 bg-background/90 backdrop-blur-sm">
                    {/* Library Preview */}
                    <div className="absolute inset-0 flex flex-col">
                      {/* Library Header */}
                      <div className="flex items-center justify-between p-4 border-b border-primary/10">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <BookOpen className="h-8 w-8 text-primary/60" />
                            <motion.div
                              className="absolute inset-0"
                              animate={{
                                opacity: [0.4, 1, 0.4],
                                scale: [1, 1.1, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <BookOpen className="h-8 w-8 text-primary/10" />
                            </motion.div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">Library</h3>
                            <p className="text-sm text-muted-foreground/80">
                              12 notes • 4 categories
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Search className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Grid2X2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>

                      {/* Categories */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {[
                          { name: "Research Notes", count: 5, expanded: true },
                          { name: "Meeting Notes", count: 3 },
                          { name: "Ideas", count: 2 },
                          { name: "Uncategorized", count: 2 },
                        ].map((category, index) => (
                          <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm hover:border-border/60 hover:bg-card/40 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3 p-3">
                              <ChevronRight
                                className={cn(
                                  "h-5 w-5 text-primary/60",
                                  category.expanded && "rotate-90"
                                )}
                              />
                              <div className="flex items-center gap-2">
                                <FolderIcon className="h-5 w-5 text-primary/60" />
                                <span className="text-sm font-medium">
                                  {category.name}
                                </span>
                                <span className="text-xs text-muted-foreground/70">
                                  ({category.count})
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-2/5 space-y-4 sm:space-y-6 mt-4 md:mt-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Smart Library
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    Your Notes, Automatically Organized
                  </h3>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    Don&apos;t worry about complex organization systems. Your
                    notes are automatically categorized and easily accessible.
                    Browse them naturally when you want to explore without AI
                    assistance.
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Smart categorization
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Flexible viewing options
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Quick search and filters
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Essential Tools Section */}
        <section className="relative py-24 sm:py-32 md:py-40">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

          {/* Add consistent background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute rounded-full top-1/3 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-primary/30 blur-[120px]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.08, 0.15, 0.08] }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
              className="absolute rounded-full bottom-1/3 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-secondary/30 blur-[120px]"
            />
          </div>

          <div className="relative z-10 px-4 sm:px-6 mx-auto max-w-7xl">
            <div className="mb-16 sm:mb-20 text-center space-y-6 sm:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Powerful Features
                </span>
              </motion.div>
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                  Smart, Yet Simple
                </h2>
                <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
                  All the tools you need to capture, retrieve, and interact with
                  your knowledge, wrapped in an elegant interface that makes
                  complex tasks feel simple.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 mt-8 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Natural Conversations",
                  description:
                    "Just ask questions in plain English - no complex search syntax or filters needed",
                  icon: BotMessageSquare,
                },
                {
                  title: "Smart Discovery",
                  description:
                    "Find anything without remembering tags or folder locations",
                  icon: Search,
                },
                {
                  title: "Automatic Context",
                  description:
                    "Every answer shows you exactly where it came from - no manual linking required",
                  icon: StickyNote,
                },
                {
                  title: "Distraction-Free",
                  description:
                    "A clean interface that hides complexity until you need it",
                  icon: Maximize,
                },
                {
                  title: "Auto-Connected",
                  description:
                    "AI finds relationships between notes - no manual tagging needed",
                  icon: Waypoints,
                },
                {
                  title: "Math & Formulas",
                  description:
                    "Write equations naturally with built-in LaTeX support",
                  icon: Sigma,
                },
                {
                  title: "Code Snippets",
                  description:
                    "Share code with automatic language detection and formatting",
                  icon: Code,
                },
                {
                  title: "Always Available",
                  description:
                    "Access your notes from any device, always in sync",
                  icon: Cloud,
                },
              ].map((feature, index) => (
                <FuturisticCard
                  key={feature.title}
                  delay={index * 0.1}
                  className="backdrop-blur-sm"
                >
                  <div className="space-y-2 sm:space-y-3">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    <h3 className="text-base sm:text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </FuturisticCard>
              ))}
            </div>
          </div>
        </section>

        {/* Powerful Editor Section */}
        <section className="relative py-24 sm:py-32 md:py-40 overflow-hidden">
          {/* Atmospheric background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute rounded-full top-1/3 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-primary/30 blur-[120px]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.08, 0.15, 0.08] }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
              className="absolute rounded-full bottom-1/3 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-secondary/30 blur-[120px]"
            />
          </div>

          <div className="relative z-10 px-4 sm:px-6 mx-auto max-w-7xl">
            <div className="mb-16 sm:mb-20 text-center space-y-6 sm:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
              >
                <Text className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Powerful Editor
                </span>
              </motion.div>
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                  Write Without Limits
                </h2>
                <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground">
                  A powerful editor that stays out of your way. Focus on writing
                  while AI works in the background.
                </p>
              </div>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative aspect-[16/10] sm:aspect-video rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-2xl shadow-primary/10"
              >
                <Image
                  src={getImageUrl("editor")}
                  alt="Nebriq Editor"
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90" />

                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 md:p-8 lg:p-12">
                  <div className="max-w-3xl mx-auto space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground">
                      Just Write
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground/90 max-w-2xl">
                      A clean, minimal interface that lets you focus on what
                      matters most - your ideas. No cluttered toolbars, just
                      pure writing bliss.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="relative py-24 sm:py-32 md:py-40">
          {/* Add consistent background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute rounded-full top-1/3 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-primary/30 blur-[120px]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.08, 0.15, 0.08] }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
              className="absolute rounded-full bottom-1/3 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-secondary/30 blur-[120px]"
            />
          </div>

          <div className="relative z-10 px-4 sm:px-6 mx-auto text-center max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative p-8 sm:p-12 rounded-2xl border border-primary/20 bg-background/60 backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-secondary/5 rounded-2xl" />
              <Badge variant="secondary" className="mb-6 sm:mb-8">
                Early Access
              </Badge>
              <h2 className="mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl font-bold">
                Turn Notes Into Knowledge
              </h2>
              <p className="mb-8 sm:mb-10 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Join us in building the future of personal knowledge management.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 text-lg px-8 py-6 h-auto hover:scale-105 transition-transform duration-200"
                onClick={scrollToHero}
              >
                Join Waitlist
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t bg-background/60 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
          <div className="relative z-10 px-4 sm:px-6 py-12 sm:py-16 mx-auto max-w-7xl">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 gap-6 sm:gap-8 mb-6 sm:mb-8 sm:grid-cols-2 md:grid-cols-3">
              {/* Company Info */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-sm sm:text-base font-semibold">About</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="https://microlaunch.net/p/nebriq"
                      className="text-xs sm:text-sm transition-colors text-muted-foreground hover:text-foreground"
                    >
                      Microlaunch
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-sm sm:text-base font-semibold">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/terms"
                      className="text-xs sm:text-sm transition-colors text-muted-foreground hover:text-foreground"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-xs sm:text-sm transition-colors text-muted-foreground hover:text-foreground"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Connect */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-sm sm:text-base font-semibold">Connect</h3>
                <div className="flex space-x-4">
                  <Link
                    href="https://x.com/getnebriq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                  <Link
                    href="mailto:hi@nebriq.com"
                    className="transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </div>
              </div>
            </div>

            <Separator className="my-4 sm:my-6 md:my-8" />

            {/* Bottom Footer */}
            <div className="flex flex-col items-center justify-between space-y-3 md:flex-row md:space-y-0 text-center md:text-left">
              <span className="text-xs sm:text-sm text-muted-foreground">
                © {new Date().getFullYear()} Nebriq. All rights reserved.
              </span>

              <div className="flex items-center space-x-1 text-xs sm:text-sm text-muted-foreground">
                <span>Built with</span>
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 mx-1 text-primary/80" />
                <span>by</span>
                <Link
                  href="https://paulbg.dev"
                  className="ml-1 transition-colors text-muted-foreground hover:text-foreground"
                >
                  Paul Bogatyr
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

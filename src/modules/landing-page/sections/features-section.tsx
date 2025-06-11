"use client";

import React, { memo, Suspense } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  BotMessageSquare, 
  StickyNote, 
  Waypoints,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";

// Lazy load heavy visualization components
const KnowledgeGraphVisualization = React.lazy(() => 
  import("@/modules/landing-page/features/visuals/knowledge-graph-visualization").then(
    module => ({ default: module.KnowledgeGraphVisualization })
  )
);

const SemanticConnectionsVisualization = React.lazy(() => 
  import("@/modules/landing-page/features/visuals/semantic-connections-visualization").then(
    module => ({ default: module.SemanticConnectionsVisualization })
  )
);

const SmartLibraryVisualization = React.lazy(() => 
  import("@/modules/landing-page/features/visuals/smart-library-visualization").then(
    module => ({ default: module.SmartLibraryVisualization })
  )
);

// Loading fallback component
const VisualizationLoader = () => (
  <div className="flex items-center justify-center w-full h-full min-h-[300px] bg-muted/20 rounded-xl">
    <div className="flex items-center gap-3 text-muted-foreground">
      <Loader2 className="w-6 h-6 animate-spin" />
      <span className="text-sm">Loading visualization...</span>
    </div>
  </div>
);

// Memoized feature badge component
const FeatureBadge = memo(({ icon: Icon, text }: {
  icon: React.ElementType;
  text: string;
}) => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
    <Icon className="w-4 h-4 text-primary" />
    <span className="text-sm font-medium text-primary">{text}</span>
  </div>
));

FeatureBadge.displayName = "FeatureBadge";

// Memoized feature list component
const FeatureList = memo(({ items }: { items: string[] }) => (
  <ul className="space-y-3">
    {items.map((item, index) => (
      <li key={index} className="flex items-center gap-3 text-muted-foreground">
        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
        <span className="text-sm">{item}</span>
      </li>
    ))}
  </ul>
));

FeatureList.displayName = "FeatureList";

// Memoized feature section component
const FeatureSection = memo(({ 
  badge,
  title,
  description,
  features,
  visualization,
  reversed = false,
  delay = 0
}: {
  badge: { icon: React.ElementType; text: string };
  title: string;
  description: string;
  features: string[];
  visualization: React.ReactNode;
  reversed?: boolean;
  delay?: number;
}) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.21, 0.45, 0.27, 0.99] }
  };

  return (
    <motion.div
      {...fadeInUp}
      className={`flex flex-col gap-8 lg:gap-12 items-center ${
        reversed ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      {/* Visualization */}
      <div className="w-full lg:w-3/5">
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm shadow-lg">
          {/* Subtle glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl blur-xl opacity-50 -z-10" />
          {visualization}
        </div>
      </div>

      {/* Content */}
      <div className="w-full lg:w-2/5 space-y-6">
        <div className="space-y-4">
          <FeatureBadge icon={badge.icon} text={badge.text} />
          
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            {title}
          </h3>
          
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <FeatureList items={features} />
      </div>
    </motion.div>
  );
});

FeatureSection.displayName = "FeatureSection";

export const FeaturesOverviewSection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.21, 0.45, 0.27, 0.99] }
  };

  const features = [
    {
      badge: { icon: Sparkles, text: "Smart Analysis" },
      title: "Chat with Your Notes",
      description: "Ask questions about your notes in natural language and get immediate answers. Our AI understands context across all your notes and delivers relevant insights with source references.",
      features: [
        "Natural language queries",
        "Source-linked answers",
        "Cross-note understanding",
        "Contextual insights"
      ],
      visualization: (
        <Suspense fallback={<VisualizationLoader />}>
          <div className="relative h-full">
            {/* Chat Interface Mock */}
            <div className="absolute inset-4 flex flex-col">
              <div className="flex items-center gap-2 pb-3 border-b border-border/50">
                <BotMessageSquare className="w-5 h-5 text-primary" />
                <span className="font-medium text-sm">Chat with Briq</span>
              </div>
              
              <div className="flex-1 py-4 space-y-4">
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-sm max-w-[80%] text-sm">
                    What are the key points from my meeting notes?
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg rounded-tl-sm max-w-[80%] text-sm">
                    <p className="mb-2">Here are the key points from your meeting:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Project deadline extended to Friday</li>
                      <li>• New feature requirements added</li>
                      <li>• Weekly updates agreed upon</li>
                    </ul>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <StickyNote className="w-3 h-3" />
                      <span>From: Meeting Notes</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 rounded-lg border border-input bg-background">
                <input
                  className="flex-1 bg-transparent text-xs placeholder:text-muted-foreground"
                  placeholder="Ask about your notes..."
                  disabled
                />
                <Button size="sm" className="h-6 w-6 rounded-full p-0" disabled>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </Suspense>
      )
    },
    {
      badge: { icon: Waypoints, text: "Visual Connections" },
      title: "Knowledge Graph",
      description: "Visualize how your ideas connect. Our interactive knowledge graph helps you explore relationships between notes and discover new patterns in your thinking.",
      features: [
        "Interactive visualization",
        "Pattern discovery",
        "Relationship mapping",
        "Exploration tools"
      ],
      visualization: (
        <Suspense fallback={<VisualizationLoader />}>
          <KnowledgeGraphVisualization />
        </Suspense>
      )
    },
    {
      badge: { icon: Waypoints, text: "Smart Connections" },
      title: "Discover Connections While Writing",
      description: "Our AI automatically identifies connections between your notes as you write. See related content without breaking your flow, helping you build a more interconnected knowledge base.",
      features: [
        "Real-time connection discovery",
        "Content and title matching",
        "One-click navigation",
        "Flow-preserving suggestions"
      ],
      visualization: (
        <Suspense fallback={<VisualizationLoader />}>
          <SemanticConnectionsVisualization />
        </Suspense>
      )
    },
    {
      badge: { icon: BotMessageSquare, text: "Smart Library" },
      title: "Your Notes, Automatically Organized",
      description: "Don't worry about complex organization systems. Your notes are automatically categorized and easily accessible. Browse them naturally when you want to explore without AI assistance.",
      features: [
        "Smart categorization",
        "Flexible viewing options",
        "Quick search and filters",
        "Natural browsing experience"
      ],
      visualization: (
        <Suspense fallback={<VisualizationLoader />}>
          <SmartLibraryVisualization />
        </Suspense>
      )
    }
  ];

  return (
    <section id="features" className="relative py-16 sm:py-24">
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
              <FeatureBadge icon={Sparkles} text="Core Features" />
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Simple Writing,
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Smart Organization
              </span>
            </h2>

            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Just write. AI automatically connects and organizes your notes behind the scenes.
            </p>
          </motion.div>

          {/* Features List */}
          <div className="space-y-24">
            {features.map((feature, index) => (
              <FeatureSection
                key={index}
                {...feature}
                reversed={index % 2 === 1}
                delay={0.3 + index * 0.1}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
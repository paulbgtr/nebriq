import React from "react";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export function PricingFAQ() {
  const faqItems: FAQItem[] = [
    {
      question: "Why does Nebriq have a premium tier?",
      answer: (
        <p>
          Nebriq integrates with advanced AI models to help you organize
          knowledge, create content, and enhance your productivity. These
          powerful models require significant resources to operate. Our premium
          tier ensures we can provide reliable access to the best AI technology
          while continuing to improve Nebriq&apos;s intelligent features and
          experience.
        </p>
      ),
    },
    {
      question: "What AI capabilities are available in Nebriq?",
      answer: (
        <div className="space-y-2">
          <p>
            Nebriq leverages cutting-edge AI to transform how you create,
            manage, and connect knowledge:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-medium">Smart semantic connections</span> -
              Automatically link related concepts across your content
            </li>
            <li>
              <span className="font-medium">AI-powered writing assistance</span>{" "}
              - Get intelligent suggestions to elevate your content
            </li>
            <li>
              <span className="font-medium">Knowledge graph visualization</span>{" "}
              - See how your ideas connect in intuitive visual format
            </li>
            <li>
              <span className="font-medium">Context-aware search</span> - Find
              exactly what you need based on meaning, not just keywords
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "What's the difference between model categories?",
      answer: (
        <div className="space-y-2">
          <p>Nebriq gives you access to three categories of AI models:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-medium">Beginner</span> - Perfect for
              everyday tasks like proofreading, simple summaries, and basic
              assistance
            </li>
            <li>
              <span className="font-medium">Advanced</span> - Ideal for complex
              writing, deep analysis, and sophisticated content creation
            </li>
            <li>
              <span className="font-medium">Specialized</span> - Optimized for
              specific domains like academic writing, creative content, or
              technical documentation
            </li>
          </ul>
        </div>
      ),
    },
    {
      question: "How does Nebriq's priority system work?",
      answer: (
        <p>
          Premium subscribers receive priority access to our most advanced AI
          models. This means your requests are processed first, ensuring faster
          response times even during peak usage. Free tier users still get
          access to essential features, but may experience longer processing
          times during high-demand periods.
        </p>
      ),
    },
    {
      question: "Who owns the content I create with Nebriq?",
      answer: (
        <p>
          You retain 100% ownership of all content created with Nebriq. Whether
          you&apos;re using our free or premium tier, everything you write,
          organize, and develop is entirely yours to use however you wish.
          We&apos;re simply providing the tools to help you create better
          content, faster.
        </p>
      ),
    },
    {
      question: "How does Nebriq handle my data?",
      answer: (
        <div className="space-y-2">
          <p>
            We&apos;re committed to your privacy and data security. When you
            enable our &quot;Privacy mode,&quot; your content is processed
            locally without being stored on our servers or used for model
            training.
          </p>
          <p>
            By default, we may collect anonymized usage data to improve our
            services and provide personalized features like semantic linking.
            You can adjust your privacy settings at any time through your
            account preferences.
          </p>
        </div>
      ),
    },
    {
      question: "What makes Nebriq different from other writing tools?",
      answer: (
        <div className="space-y-2">
          <p>
            Unlike typical note-taking or writing apps, Nebriq creates an
            intelligent knowledge ecosystem that:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Automatically identifies and builds connections between your ideas
            </li>
            <li>
              Creates a visual knowledge graph that evolves with your thinking
            </li>
            <li>
              Offers contextual AI assistance that understands the full scope of
              your work
            </li>
            <li>
              Provides a seamlessly integrated library that makes knowledge
              retrieval intuitive
            </li>
          </ul>
          <p className="mt-2">
            This creates a transformative experience where your ideas become
            more valuable over time as their relationships and context grow
            richer.
          </p>
        </div>
      ),
    },
    {
      question: "How can I get help with Nebriq?",
      answer: (
        <p>
          Our community forum is the best place to connect, share ideas, and get
          assistance from both our team and other Nebriq users. For private
          inquiries, you can reach our support team directly at
          support@nebriq.com. Premium subscribers receive priority support with
          faster response times.
        </p>
      ),
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header with subtle gradient and animation */}
      <div className="relative overflow-hidden mb-12 p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-background border border-primary/10">
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

        {/* Animated accent */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center p-1.5 rounded-full bg-primary/10 text-primary">
              <HelpCircle className="h-4 w-4" />
            </div>
            <p className="text-sm font-medium text-primary">Have Questions?</p>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Frequently Asked Questions
          </h2>

          <p className="text-muted-foreground max-w-xl text-sm sm:text-base leading-relaxed">
            Learn more about Nebriq&apos;s plans, features, and how our
            intelligent knowledge platform can transform your productivity and
            creativity.
          </p>
        </div>
      </div>

      {/* FAQ Cards Grid */}
      <div className="relative">
        <div className="absolute -z-10 inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)]"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-background/80 via-background to-background/95 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
            >
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 -z-10 opacity-0 bg-primary/5 blur-xl group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Animated accent */}
              <div className="absolute -top-10 -right-10 w-16 h-16 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

              <div className="flex flex-col h-full">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex items-center justify-center p-1.5 rounded-full bg-primary/10 text-primary">
                    <HelpCircle className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground tracking-tight">
                    {item.question}
                  </h3>
                </div>

                <div className="text-sm text-muted-foreground mt-2 flex-grow">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

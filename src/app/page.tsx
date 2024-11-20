"use client";

import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge>🚀 Now in public beta</Badge>
            <h1 className={`mt-8 text-5xl md:text-7xl tracking-wide font-bold`}>
              Where Thoughts Become{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Breakthroughs
              </span>
            </h1>
            <p className="mt-8 text-xl text-muted-foreground">
              Nebriq is the intelligent knowledge companion that transforms how
              scholars, writers, and thinkers capture, connect, and cultivate
              ideas into lasting insights
            </p>
            <div className="mt-12 flex items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/signup">Start Writing</Link>
              </Button>
              <Button size="lg" variant="outline">
                Watch the Demo
              </Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
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
        </div>
      </div>

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

          <div className="grid md:grid-cols-2 gap-16">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted border mb-8">
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  nebriq AI Search
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">
                Contextual Intelligence Search
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Dive beyond keywords. Our AI understands the nuanced context of
                your research, surfacing insights you didn&apos;t even know you
                were looking for.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted border mb-8">
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  nebriq Graph View
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">Idea Constellation Map</h3>
              <p className="text-muted-foreground leading-relaxed">
                Visualize the constellation of your thoughts. Watch how
                seemingly disparate ideas orbit and intersect in your personal
                knowledge universe.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                Craft Without Constraints
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We&apos;ve engineered Nebriq to respect your intellectual flow.
                Our minimalist design meets powerful functionality, letting your
                creativity breathe without technological friction.
              </p>
              <div className="space-y-4">
                {[
                  "nebriq's zen-like writing environment",
                  "Enhanced markdown for scholars",
                  "Lightning-fast idea capture with nebriq",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-1 w-1 bg-foreground rounded-full" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            {/* [Editor screenshot remains the same] */}
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
            <span className="text-muted-foreground">© 2024 nebriq</span>
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

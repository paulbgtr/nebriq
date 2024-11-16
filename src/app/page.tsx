"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-sm font-medium bg-black text-white px-4 py-1.5 rounded-full">
              🚀 Now in public beta
            </span>
            <h1 className="mt-8 text-5xl md:text-7xl font-light tracking-tight">
              Your thoughts,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                organized
              </span>
            </h1>
            <p className="mt-8 text-xl text-gray-600">
              The intelligent note-taking app that adapts to your way of
              thinking
            </p>
            <div className="mt-12 flex items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-black hover:bg-gray-800">
                <Link href="/signup">Get started for free</Link>
              </Button>
              <Button size="lg" variant="outline">
                Watch demo
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
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 border shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <Image
                  src="/hero-image.png"
                  alt="Screenshot of the note-taking app interface"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-light">
              Everything you need to think better
            </h2>
            <p className="mt-4 text-gray-600">
              Powerful features that help you capture, connect, and retrieve
              your ideas
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
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border mb-8">
                <div className="h-full flex items-center justify-center text-gray-400">
                  AI Search screenshot
                </div>
              </div>
              <h3 className="text-xl mb-4">AI-Powered Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Find anything instantly with contextual search that understands
                the meaning behind your notes, not just keywords.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border mb-8">
                <div className="h-full flex items-center justify-center text-gray-400">
                  Graph View screenshot
                </div>
              </div>
              <h3 className="text-xl mb-4">Visual Knowledge Graph</h3>
              <p className="text-gray-600 leading-relaxed">
                See how your ideas connect with an interactive visualization of
                your knowledge network.
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
              <h2 className="text-3xl font-light mb-6">
                Focus on what matters
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our minimal interface removes distractions and lets you focus on
                capturing your thoughts. With powerful keyboard shortcuts and
                markdown support, you can write naturally without breaking your
                flow.
              </p>
              <div className="space-y-4">
                {[
                  "Distraction-free editor",
                  "Markdown support",
                  "Quick capture",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-1 w-1 bg-black rounded-full" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border">
                <div className="h-full flex items-center justify-center text-gray-400">
                  Editor screenshot
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-8">
              Ready to organize your mind?
            </h2>
            <p className="text-gray-400 mb-12 max-w-xl mx-auto">
              Join thousands of thinkers who are already using nebriq to capture
              and connect their ideas.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              Start for free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">© 2024 nebriq</span>
            <div className="space-x-6">
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                Twitter
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

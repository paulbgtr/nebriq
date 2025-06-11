"use client";

import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import type {
  Product,
  ProductPrices,
} from "@polar-sh/sdk/models/components/product.js";
import { buttonVariants } from "@/shared/components/ui/button";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/shared/lib/utils";

interface LandingProductCardProps {
  product: Product;
  delay?: number;
}

// Helper function to check if a price is a valid, displayable recurring price
const getDisplayPrice = (
  prices: ProductPrices[] | undefined
): ProductPrices | undefined => {
  if (!prices) return undefined;
  return prices.find(
    (price) =>
      price.type === "recurring" &&
      "amountType" in price &&
      price.amountType === "fixed" &&
      "priceAmount" in price &&
      typeof price.priceAmount === "number" &&
      "recurringInterval" in price &&
      typeof price.recurringInterval === "string"
  );
};

export const LandingProductCard = memo(({ 
  product, 
  delay = 0 
}: LandingProductCardProps) => {
  // Find the first suitable price to display
  const displayPrice = useMemo(() => getDisplayPrice(product.prices), [product.prices]);

  const displayAmount = displayPrice && "priceAmount" in displayPrice
    ? displayPrice.priceAmount
    : null;
    
  const displayInterval = displayPrice && "recurringInterval" in displayPrice
    ? displayPrice.recurringInterval
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative"
    >
      <div className="relative h-full p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50">
        {/* Subtle glow for paid plans */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
        
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-primary">
            {product.name}
          </h3>

          {/* Price Display */}
          {displayAmount !== null && displayInterval !== null ? (
            <div className="mb-4">
              <span className="text-4xl font-bold text-foreground">
                ${(displayAmount / 100).toFixed(2)}
              </span>
              <span className="text-muted-foreground"> / {displayInterval}</span>
            </div>
          ) : (
            <div className="mb-4 h-[60px] flex items-center justify-center">
              <span className="text-muted-foreground">Contact for pricing</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="flex-grow text-muted-foreground text-sm prose prose-sm prose-neutral dark:prose-invert mb-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {product.description ?? "Plan details"}
          </ReactMarkdown>
        </div>

        {/* Button */}
        <div className="mt-auto">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "w-full group"
            )}
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.div>
  );
});

LandingProductCard.displayName = "LandingProductCard";
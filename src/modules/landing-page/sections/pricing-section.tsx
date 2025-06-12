"use client";

import React, { memo, useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { Product } from "@polar-sh/sdk/models/components/product.js";
import { Check, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Constants for billing cycles
const BILLING_MONTH = "month";
const BILLING_YEAR = "year";

type BillingCycle = typeof BILLING_MONTH | typeof BILLING_YEAR;

interface PricingSectionProps {
  products: Product[];
}

// Memoized feature badge component
const FeatureBadge = memo(
  ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium text-primary">{text}</span>
    </div>
  ),
);

FeatureBadge.displayName = "FeatureBadge";

// Memoized billing toggle component
const BillingToggle = memo(
  ({
    billingCycle,
    setBillingCycle,
    hasYearlyProducts,
  }: {
    billingCycle: BillingCycle;
    setBillingCycle: (cycle: BillingCycle) => void;
    hasYearlyProducts: boolean;
  }) => (
    <div className="inline-flex items-center justify-center space-x-1 rounded-full bg-muted/50 p-1">
      <Button
        variant={billingCycle === BILLING_MONTH ? "secondary" : "ghost"}
        size="sm"
        className={cn(
          "rounded-full px-6 transition-all duration-200",
          billingCycle === BILLING_MONTH
            ? "shadow-sm ring-1 ring-inset ring-primary/50"
            : "",
        )}
        onClick={() => setBillingCycle(BILLING_MONTH)}
      >
        Monthly
      </Button>
      {hasYearlyProducts && (
        <Button
          variant={billingCycle === BILLING_YEAR ? "secondary" : "ghost"}
          size="sm"
          className={cn(
            "rounded-full px-6 transition-all duration-200 relative",
            billingCycle === BILLING_YEAR
              ? "shadow-sm ring-1 ring-inset ring-primary/50"
              : "",
          )}
          onClick={() => setBillingCycle(BILLING_YEAR)}
        >
          Annual
          <span className="absolute -top-2 -right-2 text-xs bg-primary/20 text-primary font-semibold px-1.5 py-0.5 rounded-full">
            Save 20%
          </span>
        </Button>
      )}
    </div>
  ),
);

BillingToggle.displayName = "BillingToggle";

// Memoized free plan card component
const FreePlanCard = memo(({ delay = 0 }: { delay?: number }) => {
  const features = [
    "Simple AI Chat",
    "Powerful Editor (Maths, Code, Markdown)",
    "Backlinks & Tags",
    "Up to 50 Notes",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative"
    >
      <div className="relative h-full p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-foreground">
            Free Plan
          </h3>
          <div className="mb-6">
            <span className="text-4xl font-bold text-foreground">$0</span>
            <span className="text-muted-foreground"> / forever</span>
          </div>
        </div>

        <ul className="space-y-3 mb-8 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full bg-background hover:bg-muted border-border/60 hover:border-border transition-all duration-200",
            )}
          >
            Start Creating Notes - It&apos;s Free!
          </Link>
        </div>
      </div>
    </motion.div>
  );
});

FreePlanCard.displayName = "FreePlanCard";

// Memoized paid plan card component
const PaidPlanCard = memo(
  ({
    product,
    billingCycle,
    delay = 0,
  }: {
    product: Product;
    billingCycle: BillingCycle;
    delay?: number;
  }) => {
    // Find the appropriate price for the current billing cycle
    const displayPrice = useMemo(() => {
      if (!product.prices) return undefined;
      return product.prices.find(
        (price) =>
          price.type === "recurring" &&
          "amountType" in price &&
          price.amountType === "fixed" &&
          "priceAmount" in price &&
          typeof price.priceAmount === "number" &&
          "recurringInterval" in price &&
          price.recurringInterval === billingCycle,
      );
    }, [product.prices, billingCycle]);

    const displayAmount =
      displayPrice && "priceAmount" in displayPrice
        ? displayPrice.priceAmount
        : null;

    const displayInterval =
      displayPrice && "recurringInterval" in displayPrice
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

            {displayAmount !== null && displayInterval !== null ? (
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">
                  ${(displayAmount / 100).toFixed(2)}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  / {displayInterval}
                </span>
              </div>
            ) : (
              <div className="mb-4 h-[60px] flex items-center justify-center">
                <span className="text-muted-foreground">
                  Contact for pricing
                </span>
              </div>
            )}
          </div>

          <div className="flex-grow text-muted-foreground text-sm prose prose-sm prose-neutral dark:prose-invert mb-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {product.description ?? "Plan details"}
            </ReactMarkdown>
          </div>

          <div className="mt-auto">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "w-full group",
              )}
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.div>
    );
  },
);

PaidPlanCard.displayName = "PaidPlanCard";

// Helper function to safely get amount
const getAmount = (p: Product["prices"][number] | undefined): number | null => {
  if (
    typeof p === "object" &&
    p !== null &&
    "priceAmount" in p &&
    typeof p.priceAmount === "number"
  ) {
    return p.priceAmount;
  }
  return null;
};

export const PricingSection = ({ products }: PricingSectionProps) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(BILLING_MONTH);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.21, 0.45, 0.27, 0.99] },
  };

  // Optimized product filtering and sorting
  const { paidProducts, monthlyProducts, yearlyProducts } = useMemo(() => {
    const paid = products.filter((p) =>
      p.prices?.some(
        (price) =>
          price.type === "recurring" &&
          "amountType" in price &&
          price.amountType === "fixed" &&
          getAmount(price) !== null,
      ),
    );

    const monthly = paid.filter((p) =>
      p.prices?.some(
        (price) =>
          price.type === "recurring" &&
          "recurringInterval" in price &&
          price.recurringInterval === BILLING_MONTH,
      ),
    );

    const yearly = paid.filter((p) =>
      p.prices?.some(
        (price) =>
          price.type === "recurring" &&
          "recurringInterval" in price &&
          price.recurringInterval === BILLING_YEAR,
      ),
    );

    // Sort by price ascending
    const sortFn = (a: Product, b: Product) => {
      const priceA = a.prices?.find(
        (p) =>
          p.type === "recurring" &&
          "amountType" in p &&
          p.amountType === "fixed",
      );
      const priceB = b.prices?.find(
        (p) =>
          p.type === "recurring" &&
          "amountType" in p &&
          p.amountType === "fixed",
      );
      const amountA = getAmount(priceA);
      const amountB = getAmount(priceB);
      return (amountA ?? Infinity) - (amountB ?? Infinity);
    };

    monthly.sort(sortFn);
    yearly.sort(sortFn);

    return {
      paidProducts: paid,
      monthlyProducts: monthly,
      yearlyProducts: yearly,
    };
  }, [products]);

  const displayProducts =
    billingCycle === BILLING_MONTH ? monthlyProducts : yearlyProducts;
  const hasPaidProducts = paidProducts.length > 0;
  const hasYearlyProducts = yearlyProducts.length > 0;

  return (
    <section id="pricing" className="relative py-16 sm:py-24">
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
            className="text-center space-y-6"
          >
            {/* Badge */}
            <div className="flex justify-center">
              <FeatureBadge icon={Sparkles} text="Simple Pricing" />
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Start Free,
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Scale as You Grow
              </span>
            </h2>

            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Choose the plan that fits your workflow. Start for free, upgrade
              when you need more power.
            </p>

            {/* Billing Toggle */}
            {hasPaidProducts && (
              <motion.div
                {...fadeInUp}
                transition={{ delay: 0.3 }}
                className="flex justify-center"
              >
                <BillingToggle
                  billingCycle={billingCycle}
                  setBillingCycle={setBillingCycle}
                  hasYearlyProducts={hasYearlyProducts}
                />
              </motion.div>
            )}
          </motion.div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {/* Free Plan Card */}
            <FreePlanCard delay={0.5} />

            {/* Paid Plan Cards */}
            {displayProducts.map((product, index) => (
              <PaidPlanCard
                key={product.id}
                product={product}
                billingCycle={billingCycle}
                delay={0.6 + index * 0.1}
              />
            ))}

            {/* No paid products fallback */}
            {!hasPaidProducts && (
              <motion.div
                {...fadeInUp}
                transition={{ delay: 0.6 }}
                className="md:col-span-2 lg:col-span-2 text-center p-8"
              >
                <p className="text-muted-foreground">
                  More plans coming soon. Start with our free plan today!
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

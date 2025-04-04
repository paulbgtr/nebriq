"use client";

import { useState, useMemo } from "react";
import type { Product } from "@polar-sh/sdk/models/components/product.js";
import { LandingProductCard } from "../features/pricing/landing-product-card";
import { Check } from "lucide-react";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";

// Constants for billing cycles
const BILLING_MONTH = "month";
const BILLING_YEAR = "year";

type BillingCycle = typeof BILLING_MONTH | typeof BILLING_YEAR;

interface PricingSectionProps {
  products: Product[];
}

// Helper function to safely get amount - Improve typing
const getAmount = (p: Product["prices"][number] | undefined): number | null => {
  // Check if p is defined and an object
  if (typeof p === "object" && p !== null) {
    // Check for priceAmount property
    if ("priceAmount" in p && typeof p.priceAmount === "number") {
      return p.priceAmount;
    }
  }
  return null;
};

export const PricingSection = ({ products }: PricingSectionProps) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(BILLING_MONTH);

  // Filter products: must have a recurring price with a fixed amount
  const paidProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.prices?.some(
            (price) =>
              price.type === "recurring" &&
              "amountType" in price &&
              price.amountType === "fixed" &&
              getAmount(price) !== null
          )
      ),
    [products]
  );

  // Separate products into monthly and yearly
  const monthlyProducts = useMemo(
    () =>
      paidProducts.filter(
        (p) =>
          p.prices?.some(
            (price) =>
              price.type === "recurring" &&
              "recurringInterval" in price &&
              price.recurringInterval === BILLING_MONTH
          )
      ),
    [paidProducts]
  );

  const yearlyProducts = useMemo(
    () =>
      paidProducts.filter(
        (p) =>
          p.prices?.some(
            (price) =>
              price.type === "recurring" &&
              "recurringInterval" in price &&
              price.recurringInterval === BILLING_YEAR
          )
      ),
    [paidProducts]
  );

  // Sort each group by price ascending
  useMemo(() => {
    const sortFn = (a: Product, b: Product) => {
      const priceA = a.prices?.find(
        (p) =>
          p.type === "recurring" &&
          "amountType" in p &&
          p.amountType === "fixed"
      );
      const priceB = b.prices?.find(
        (p) =>
          p.type === "recurring" &&
          "amountType" in p &&
          p.amountType === "fixed"
      );
      const amountA = getAmount(priceA);
      const amountB = getAmount(priceB);
      return (amountA ?? Infinity) - (amountB ?? Infinity);
    };
    monthlyProducts.sort(sortFn);
    yearlyProducts.sort(sortFn);
  }, [monthlyProducts, yearlyProducts]);

  // Determine which products to display based on state
  const displayProducts =
    billingCycle === BILLING_MONTH ? monthlyProducts : yearlyProducts;

  const hasPaidProducts = paidProducts.length > 0;
  const hasYearlyProducts = yearlyProducts.length > 0;

  return (
    <section
      id="pricing"
      className="w-full bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container mx-auto px-4 md:px-6 py-20 md:py-28 lg:py-32">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Choose the plan that fits your workflow. Start for free, upgrade
            when you need more power.
          </p>

          {/* Billing Cycle Toggle Switch */}
          {hasPaidProducts && (
            <div className="inline-flex items-center justify-center space-x-1 rounded-full bg-muted/60 p-1 mb-5">
              <Button
                variant={billingCycle === BILLING_MONTH ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "rounded-full px-6 transition-all duration-200",
                  billingCycle === BILLING_MONTH
                    ? "shadow-sm ring-1 ring-inset ring-primary/50"
                    : ""
                )}
                onClick={() => setBillingCycle(BILLING_MONTH)}
              >
                Monthly
              </Button>
              {hasYearlyProducts && (
                <Button
                  variant={
                    billingCycle === BILLING_YEAR ? "secondary" : "ghost"
                  }
                  size="sm"
                  className={cn(
                    "rounded-full px-6 transition-all duration-200 relative",
                    billingCycle === BILLING_YEAR
                      ? "shadow-sm ring-1 ring-inset ring-primary/50"
                      : ""
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
          )}
        </div>

        {/* Combined Grid for Free and Paid Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Free Plan Card - First item in the grid */}
          <div
            className={cn(
              "flex flex-col p-6 bg-card/60 backdrop-blur-sm rounded-lg shadow-lg border border-border/70 h-full",
              "transition-all duration-300 hover:shadow-primary/10"
            )}
          >
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Free Plan
            </h3>

            {/* Price equivalent (Free) */}
            <div className="mb-6 text-center">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground"> / forever</span>
            </div>

            {/* Benefits List */}
            <ul className="space-y-2 text-muted-foreground mb-8">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>Simple AI Chat</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>Powerful Editor (Maths, Code, Markdown)</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>Backlinks & Tags</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span>Up to 50 Notes</span>
              </li>
            </ul>

            {/* Spacer to push button down */}
            <div className="flex-grow"></div>

            {/* Improved CTA Button */}
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full mt-8 bg-background hover:bg-muted border-border/60 hover:border-border transition-all duration-200"
              )}
            >
              Start Creating Notes - It&apos;s Free!
            </Link>
          </div>

          {/* Paid Plan Cards - Mapped after Free card */}
          {displayProducts.map((product) => (
            <LandingProductCard key={product.id} product={product} />
          ))}

          {/* Optional: Placeholder if no paid products match toggle */}
          {!hasPaidProducts && (
            <div className="md:col-span-2 lg:col-span-3 text-center p-8 text-muted-foreground">
              No paid plans available.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

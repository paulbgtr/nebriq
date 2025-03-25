"use client";

import { useMemo, useState } from "react";
import type { Product } from "@polar-sh/sdk/models/components/product.js";
import { useUser } from "@/shared/hooks/use-user";
import { ProductCard } from "./components/product-card";
import { Button } from "@/shared/components/ui/button";
import { Loader2, LogIn, Sparkles } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

interface ProductsSectionProps {
  products: Product[];
}

export const ProductsSection = ({ products }: ProductsSectionProps) => {
  const { user, isPending } = useUser();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  // Group products by type and billing cycle
  const organizedProducts = useMemo(() => {
    // Extract unique product types (Free, Personal, Pro)
    const productTypes = [
      ...new Set(
        products.map((p) => {
          const name = p.name.toLowerCase();
          if (name.includes("free")) return "free";
          if (name.includes("personal")) return "personal";
          if (name.includes("pro")) return "pro";
          return "other";
        })
      ),
    ];

    // Group by product type and billing cycle
    const grouped = productTypes.reduce<
      Record<string, Record<string, Product>>
    >((acc, type) => {
      acc[type] = {};

      // Find products of this type
      const typeProducts = products.filter((p) => {
        const name = p.name.toLowerCase();
        return name.includes(type);
      });

      // Group by billing cycle
      typeProducts.forEach((product) => {
        const interval =
          product.prices[0]?.recurringInterval?.toLowerCase() || "none";
        // Map API intervals to our UI intervals
        if (interval === "month") {
          acc[type]["monthly"] = product;
        } else if (interval === "year") {
          acc[type]["yearly"] = product;
        } else {
          acc[type][interval] = product;
        }
      });

      return acc;
    }, {});

    return grouped;
  }, [products]);

  // Sort product types in the desired order and filter by the selected billing cycle
  const displayProducts = useMemo(() => {
    const order = { free: 0, personal: 1, pro: 2, other: 3 };

    return Object.entries(organizedProducts)
      .sort(
        ([typeA], [typeB]) =>
          order[typeA as keyof typeof order] -
          order[typeB as keyof typeof order]
      )
      .map(([type, intervals]) => {
        // For free tier, always return it regardless of billing cycle
        if (type === "free" && intervals["none"]) {
          return intervals["none"];
        }

        // Return the product matching the selected billing cycle
        return intervals[billingCycle];
      })
      .filter(Boolean) as Product[];
  }, [organizedProducts, billingCycle]);

  if (isPending) {
    return (
      <div className="col-span-full min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-card/30 border border-border/50">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading subscription options...
          </p>
        </div>
      </div>
    );
  }

  if (!user?.id) {
    return (
      <div className="col-span-full min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 p-8 max-w-md rounded-xl bg-card/20 border border-border/60">
          <div className="p-3 rounded-full bg-primary/10">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-medium mb-2">Sign in to continue</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please sign in to view and manage your subscription options.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="col-span-full mb-8 flex flex-col items-center">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-lg font-medium">Billing Cycle</h3>
          {billingCycle === "yearly" && (
            <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              Save 20%
            </div>
          )}
        </div>
        <Tabs
          value={billingCycle}
          onValueChange={(value) =>
            setBillingCycle(value as "monthly" | "yearly")
          }
          className="w-full max-w-xs"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {displayProducts.map((product) => (
        <ProductCard
          key={`${product.id}-${billingCycle}`}
          product={product}
          userId={user.id as string}
          userEmail={user.email as string}
        />
      ))}
    </>
  );
};

"use client";

import type { Product } from "@polar-sh/sdk/models/components/product.js";
import { useUser } from "@/shared/hooks/use-user";
import { ProductCard } from "./components/product-card";
import { Button } from "@/shared/components/ui/button";
import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface ProductsSectionProps {
  products: Product[];
}

export const ProductsSection = ({ products }: ProductsSectionProps) => {
  const { user, isPending } = useUser();

  const checkoutMetadata = useMemo(() => {
    return encodeURIComponent(
      JSON.stringify({
        userId: user?.id,
        customerEmail: user?.email,
        timestamp: new Date().toISOString(),
      })
    );
  }, [user?.id, user?.email]);

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

  const checkoutUrl = (id: string) =>
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout?productId=${id}&metadata=${checkoutMetadata}`;

  // Check if products array has enough items
  if (!products || products.length === 0) {
    return (
      <div className="col-span-full min-h-[200px] flex items-center justify-center">
        <div className="p-8 text-center text-muted-foreground">
          No products available for this billing cycle.
        </div>
      </div>
    );
  }

  return (
    <>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          userId={user.id as string}
          userEmail={user.email as string}
          checkoutUrl={checkoutUrl(product.id)}
        />
      ))}
    </>
  );
};

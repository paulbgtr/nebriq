import { useMemo } from "react";
import Link from "next/link";
import type { Product } from "@polar-sh/sdk/models/components/product.js";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Separator } from "@/shared/components/ui/separator";

interface ProductCardProps {
  product: Product;
  userId: string;
  userEmail: string;
}

export const ProductCard = ({
  product,
  userId,
  userEmail,
}: ProductCardProps) => {
  const firstPrice = product.prices[0];
  const isPopular = product.name.toLowerCase().includes("pro");
  const isYearly =
    firstPrice.recurringInterval?.toLowerCase() === "year" ||
    firstPrice.recurringInterval?.toLowerCase() === "yearly";

  const price = useMemo(() => {
    switch (firstPrice.amountType) {
      case "fixed":
        return `$${firstPrice.priceAmount / 100}`;
      case "free":
        return "Free";
      default:
        return "Pay what you want";
    }
  }, [firstPrice]);

  const checkoutMetadata = useMemo(() => {
    return encodeURIComponent(
      JSON.stringify({
        userId,
        customerEmail: userEmail,
        timestamp: new Date().toISOString(),
        source: "subscription_page",
      })
    );
  }, [userId, userEmail]);

  console.log("Product details:", {
    name: product.name,
    id: product.id,
    price: firstPrice,
    isPopular,
    isYearly,
    checkoutUrl: `/api/checkout?productId=${product.id}&metadata=${checkoutMetadata}`,
  });

  const checkoutUrl = `/api/checkout?productId=${product.id}&metadata=${checkoutMetadata}`;

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between px-6 py-8 rounded-3xl h-full border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 overflow-hidden backdrop-blur-sm",
        isPopular
          ? "bg-gradient-to-b from-primary/[0.05] to-primary/[0.08] border-primary/40 shadow-primary/10"
          : "bg-card/80 border-border/80 shadow-black/[0.02]"
      )}
    >
      {/* Subtle background pattern and glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary-rgb),0.07),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="flex flex-col gap-y-6 relative z-10">
        {/* Header section */}
        <div>
          <div className="flex items-center justify-between">
            <h2
              className={cn(
                "text-2xl font-semibold",
                firstPrice.amountType === "free"
                  ? "text-foreground"
                  : "text-foreground"
              )}
            >
              {product.name}
            </h2>

            {isYearly && firstPrice.amountType === "fixed" && (
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" />
                Save 20%
              </div>
            )}
          </div>

          {/* Price with animation */}
          <div className="inline-flex items-baseline gap-x-2.5">
            <span
              className={cn(
                "text-4xl font-bold transition-transform duration-300 group-hover:scale-105"
                // isPopular ? "text-primary" : "text-foreground"
              )}
            >
              {price}
            </span>
            {firstPrice.amountType === "fixed" &&
              firstPrice.recurringInterval && (
                <span className="text-sm text-muted-foreground/80 font-medium">
                  /{firstPrice.recurringInterval}
                </span>
              )}
          </div>

          <Separator className="mt-4" />

          <div className="text-muted-foreground text-sm prose prose-sm prose-neutral dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {product.description}
            </ReactMarkdown>
          </div>
        </div>

        <ul>
          {product.benefits.map((benefit) => (
            <li
              key={benefit.id}
              className="flex flex-row gap-x-3 items-start group/benefit transition-all duration-200"
            >
              <span
                className={cn(
                  "flex-shrink-0 mt-0.5 p-0.5 rounded-full transition-colors",
                  isPopular
                    ? "text-primary bg-primary/10 group-hover/benefit:bg-primary/15"
                    : "text-primary/70 bg-primary/5 group-hover/benefit:text-primary group-hover/benefit:bg-primary/10"
                )}
              >
                <Check className="w-4 h-4" strokeWidth={2.5} />
              </span>
              <span className="text-foreground text-sm leading-relaxed">
                {benefit.description}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10">
        <Link
          href={checkoutUrl}
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full group/button transition-all duration-300",
            isPopular
              ? "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 shadow-lg shadow-primary/10"
              : "bg-muted hover:bg-muted/90 text-foreground focus:ring-2 focus:ring-border/50"
          )}
        >
          <span>Get {product.name}</span>
          <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

"use client";

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
  // We might need a checkout URL generator function or the URL itself later
  // checkoutUrl: string;
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

export const LandingProductCard = ({ product }: LandingProductCardProps) => {
  // Find the first suitable price to display
  const displayPrice = getDisplayPrice(product.prices);

  const displayAmount =
    displayPrice && "priceAmount" in displayPrice
      ? displayPrice.priceAmount
      : null;
  const displayInterval =
    displayPrice && "recurringInterval" in displayPrice
      ? displayPrice.recurringInterval
      : null;

  return (
    <div className="flex flex-col p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-lg border border-border/30 transition-all duration-300 hover:shadow-primary/20 hover:border-primary/50 h-full">
      <h3 className="text-2xl font-semibold mb-2 text-primary">
        {product.name}
      </h3>

      {/* Price Display */}
      {displayAmount !== null && displayInterval !== null && (
        <div className="mb-4">
          {" "}
          {/* Adjusted margin */}
          <span className="text-4xl font-bold">
            ${(displayAmount / 100).toFixed(2)}
          </span>
          <span className="text-muted-foreground"> / {displayInterval}</span>
        </div>
      )}
      {/* Consider adding a fallback if no displayPrice is found? */}
      {!displayPrice && (
        <div className="mb-4 h-[60px]">
          {" "}
          {/* Placeholder height matching approx price height */}
          {/* Optionally show a message like "Contact us for pricing" */}
        </div>
      )}

      {/* Description - Applying flex-grow here */}
      <div className="flex-grow text-muted-foreground text-sm prose prose-sm prose-neutral dark:prose-invert mb-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {/* Ensure description is always a string */}
          {product.description ?? "Plan details"}
        </ReactMarkdown>
      </div>

      {/* Removed the separate spacer div */}

      {/* Button */}
      <Link
        href="/login" // Link should ideally go to signup or specific checkout later
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "w-full mt-auto" // Use mt-auto for margin if needed, but flex-grow should handle it
        )}
      >
        Get Started
      </Link>
    </div>
  );
};

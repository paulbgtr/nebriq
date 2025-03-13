import { useMemo } from "react";
import Link from "next/link";
import type { Product } from "@polar-sh/sdk/models/components/product.js";

interface ProductCardProps {
  product: Product;
  userId: string;
}

export const ProductCard = ({ product, userId }: ProductCardProps) => {
  // Handling just a single price for now
  // Remember to handle multiple prices for products if you support monthly & yearly pricing plans
  const firstPrice = product.prices[0];

  const price = useMemo(() => {
    switch (firstPrice.amountType) {
      case "fixed":
        // The Polar API returns prices in cents - Convert to dollars for display
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
        timestamp: new Date().toISOString(),
        source: "subscription_page",
      })
    );
  }, [product, userId, firstPrice]);

  return (
    <div className="flex flex-col gap-y-24 justify-between p-6 md:p-8 lg:p-12 rounded-3xl bg-neutral-950 h-full border border-neutral-900">
      <div className="flex flex-col gap-y-4 md:gap-y-6 lg:gap-y-8">
        <h1 className="text-2xl md:text-3xl">{product.name}</h1>
        <p className="text-neutral-400">{product.description}</p>
        <ul className="space-y-2">
          {product.benefits.map((benefit) => (
            <li key={benefit.id} className="flex flex-row gap-x-2 items-center">
              <span className="text-lg">🔥</span> {benefit.description}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-row gap-x-4 justify-between items-center">
        <Link
          className="h-8 flex flex-row items-center justify-center rounded-full bg-white text-black font-medium px-4"
          href={`/api/checkout?productId=${product.id}&metadata=${checkoutMetadata}`}
        >
          Buy
        </Link>
        <span className="text-neutral-500">{price}</span>
      </div>
    </div>
  );
};

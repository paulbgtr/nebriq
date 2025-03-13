import { polar } from "@/shared/lib/polar/client";
import { ProductsSection } from "@/modules/subscription/features/products-section";

export default async function SubscriptionModule() {
  try {
    // Fetch products on the server
    const { result } = await polar.products.list({
      isArchived: false, // Only fetch products which are published
    });

    if (!result.items || result.items.length === 0) {
      return (
        <div className="flex flex-col gap-y-32">
          <h1 className="text-5xl">Products</h1>
          <div className="p-8 text-center text-neutral-400">
            No products are currently available. Please check back later.
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-y-32">
        <h1 className="text-5xl">Products</h1>
        <ProductsSection products={result.items} />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch products:", error);

    return (
      <div className="flex flex-col gap-y-32">
        <h1 className="text-5xl">Products</h1>
        <div className="p-8 text-center text-red-500">
          There was an error loading the products. Please try again later.
        </div>
      </div>
    );
  }
}

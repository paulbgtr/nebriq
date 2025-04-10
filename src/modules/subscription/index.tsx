import { polar } from "@/shared/lib/polar/client";
import { ProductsSection } from "@/modules/subscription/features/products-section";
import { Sparkles } from "lucide-react";
import { PricingFAQ } from "@/modules/subscription/features/components/pricing-faq";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";

export default async function SubscriptionModule() {
  const polarClient = await polar();

  const { result } = await polarClient.products.list({
    isArchived: false,
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
    <>
      <div className="relative overflow-hidden mb-12 sm:mb-16 lg:mb-20 p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-background border border-primary/10">
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center p-1.5 rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <p className="text-sm font-medium text-primary">
              Upgrade Your Experience
            </p>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Choose Your Plan
          </h1>

          <p className="text-muted-foreground max-w-xl text-sm sm:text-base leading-relaxed">
            Upgrade to unlock premium features and enhance your productivity.
            Select the plan that best fits your needs and take your experience
            to the next level.
          </p>
        </div>
      </div>

      {/* Early Bird Pricing Banner */}
      <div className="mb-10 p-4 sm:p-6 rounded-xl border border-yellow-400/30 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-500/15">
            <span className="text-lg">🔥</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg text-yellow-500">
              Early Bird Pricing
            </h3>
            <p className="text-muted-foreground mt-1">
              Current prices are{" "}
              <span className="font-medium text-yellow-500">40% off</span> for
              early adopters. Prices will increase as the product matures, so
              lock in these rates now!
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <Tabs defaultValue="monthly" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="monthly">
            <div className="relative w-full mb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto max-w-3xl container">
                <ProductsSection
                  products={result.items.filter(
                    (p) =>
                      p.prices[0].recurringInterval?.toLowerCase() !== "year" &&
                      p.prices[0].recurringInterval?.toLowerCase() !== "yearly"
                  )}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="yearly">
            <div className="relative w-full mb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto max-w-3xl container">
                <ProductsSection
                  products={result.items.filter(
                    (p) =>
                      p.prices[0].recurringInterval?.toLowerCase() === "year" ||
                      p.prices[0].recurringInterval?.toLowerCase() === "yearly"
                  )}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <PricingFAQ />
    </>
  );
}

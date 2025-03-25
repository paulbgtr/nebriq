import { Button } from "@/shared/components/ui/button";
import { ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ checkoutId: string }>;
}) {
  const [checkoutId, setCheckoutId] = useState<string | null>(null);

  useEffect(() => {
    searchParamsPromise.then((params) => {
      setCheckoutId(params.checkoutId);
    });
  }, [searchParamsPromise]);

  if (checkoutId === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative overflow-hidden p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-background border border-primary/10">
          <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-20 animate-pulse"></div>

          <div className="relative text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Payment Successful!
            </h1>

            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Thank you for your purchase! Your checkout{" "}
              <span className="font-medium">(ID: {checkoutId})</span> is being
              processed and you&apos;ll receive a confirmation email shortly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="default" className="gap-2">
                <Link href="/home">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/help">
                  Contact us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

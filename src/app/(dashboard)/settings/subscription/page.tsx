"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Check, Zap } from "lucide-react";
import { useSubscription } from "@/shared/hooks/use-subscription";
import { SettingsHeader } from "@/shared/components/settings-header";

export default function SubscriptionPage() {
  const { isPro } = useSubscription();

  return (
    <>
      <SettingsHeader
        title="Subscription"
        description="Manage your Nebriq subscription and billing."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Free Plan */}
        <Card
          className={`border ${
            !isPro ? "border-primary shadow-sm" : "border-border/60"
          }`}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Free</CardTitle>
              {!isPro && (
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  Current Plan
                </Badge>
              )}
            </div>
            <div className="mt-1 font-mono text-2xl font-bold">$0</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Basic note-taking features</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Beginner AI models only</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Limited storage space</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button disabled variant="outline" className="w-full">
              Free Plan
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card
          className={`border ${
            isPro ? "border-primary shadow-sm" : "border-border/60"
          }`}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pro</CardTitle>
              {isPro && (
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  Current Plan
                </Badge>
              )}
            </div>
            <div className="mt-1">
              <span className="font-mono text-2xl font-bold">$9.99</span>
              <span className="text-muted-foreground text-sm ml-1">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>All free features</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Access to all AI models</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Unlimited storage</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Priority support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            {isPro ? (
              <Button disabled variant="outline" className="w-full">
                Current Plan
              </Button>
            ) : (
              <Button
                variant="default"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
              >
                <Zap className="mr-2 h-4 w-4" />
                Upgrade Now
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Annual Pro Plan */}
        <Card className="border border-border/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Pro Annual</CardTitle>
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-500 border-green-500/20"
              >
                Save 20%
              </Badge>
            </div>
            <div className="mt-1">
              <span className="font-mono text-2xl font-bold">$7.99</span>
              <span className="text-muted-foreground text-sm ml-1">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>All Pro features</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Billed annually ($95.88/year)</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-primary" />
                <span>Save 20% compared to monthly</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Zap className="mr-2 h-4 w-4" />
              Upgrade Annually
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 text-sm text-muted-foreground">
        <p>
          Need help with your subscription? Contact us at{" "}
          <a
            href="mailto:hi@nebriq.com"
            className="text-primary hover:underline"
          >
            hi@nebriq.com
          </a>
        </p>
      </div>
    </>
  );
}

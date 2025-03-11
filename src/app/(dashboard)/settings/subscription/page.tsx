"use client";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Check, Zap } from "lucide-react";
import { useSubscription } from "@/shared/hooks/use-subscription";
import { SettingsHeader } from "@/shared/components/settings-header";

export default function SubscriptionPage() {
  const { isPro } = useSubscription();

  return (
    <div className="container flex flex-col">
      <SettingsHeader
        title="Subscription"
        description="Manage your Nebriq subscription and billing."
      />

      <div className="grid grid-cols-1 gap-8 pt-6">
        <div className="bg-card rounded-xl border border-border/40 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <div className="min-w-[920px]">
              {/* Header */}
              <div className="grid grid-cols-4 gap-px bg-muted/80">
                <div className="bg-card p-6">
                  <h3 className="text-xl font-medium">Choose Your Plan</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Select the plan that works best for you
                  </p>
                </div>

                {/* Free Tier Header */}
                <div className="bg-card p-6">
                  <h3 className="text-lg font-medium">Free</h3>
                  <div className="mt-2 mb-1">
                    <span className="text-2xl font-bold">$0</span>
                    <span className="text-muted-foreground text-sm">
                      /forever
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    For casual note-takers
                  </p>
                </div>

                {/* Personal Tier Header */}
                <div className="bg-card p-6 relative">
                  <div className="absolute -inset-px rounded-t-md border-t-2 border-blue-500 -top-px"></div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium">Personal</h3>
                    <Badge
                      variant="outline"
                      className="bg-blue-500/5 text-blue-500 border-blue-500/20"
                    >
                      Popular
                    </Badge>
                  </div>
                  <div className="mt-2 mb-1">
                    <span className="text-2xl font-bold">$7.99</span>
                    <span className="text-muted-foreground text-sm">
                      /month
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    For organized individuals
                  </p>
                </div>

                {/* Pro Tier Header */}
                <div className="bg-card p-6 relative">
                  <div className="absolute -inset-px rounded-t-md border-t-2 border-amber-500 -top-px"></div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium">Pro</h3>
                    <Badge
                      variant="outline"
                      className="bg-amber-500/5 text-amber-500 border-amber-500/20"
                    >
                      Best Value
                    </Badge>
                  </div>
                  <div className="mt-2 mb-1">
                    <span className="text-2xl font-bold">$9.99</span>
                    <span className="text-muted-foreground text-sm">
                      /month
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    For power users
                  </p>
                </div>
              </div>

              {/* Feature Categories */}
              <div className="grid grid-cols-4 gap-px bg-muted/80">
                {/* Notes & Organization */}
                <div className="bg-card p-6 border-t border-border/10">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    Notes & Organization
                  </h4>
                </div>
                <div className="bg-card p-6 border-t border-border/10">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Basic note-taking</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>50 notes limit</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-card p-6 border-t border-border/10">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Unlimited notes</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Advanced organization</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-card p-6 border-t border-border/10">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Unlimited notes</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Advanced organization</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Custom templates</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* AI Features */}
              <div className="grid grid-cols-4 gap-px bg-muted/80">
                <div className="bg-card p-6 border-t border-border/10">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    AI Features
                  </h4>
                </div>
                <div className="bg-card p-6 border-t border-border/10">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Basic AI suggestions</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Limited AI models</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-card p-6 border-t border-border/10">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Standard AI models</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>AI-powered organization</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-card p-6 border-t border-border/10">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Advanced AI models</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>AI-powered organization</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Smart connections</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Knowledge Graph */}
              <div className="grid grid-cols-4 gap-px bg-muted/80">
                <div className="bg-card p-6 border-t border-border/10">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    Knowledge Graph
                  </h4>
                </div>
                <div className="bg-card p-6 border-t border-border/10">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Basic graph (30 nodes)</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-card p-6 border-t border-border/10">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Enhanced graph (100 nodes)</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-card p-6 border-t border-border/10">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Full graph visualization</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Advanced filtering</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Storage */}
              <div className="grid grid-cols-4 gap-px bg-muted/80">
                <div className="bg-card p-6 border-t border-border/10">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    Storage & Support
                  </h4>
                </div>
                <div className="bg-card p-6 border-t border-border/10">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>500MB storage</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Cross-device sync</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-card p-6 border-t border-border/10">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>5GB storage</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Email support</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-card p-6 border-t border-border/10">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Unlimited storage</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>Early access to features</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-4 gap-px bg-muted/80">
                <div className="bg-card p-6 border-t border-border/10"></div>
                <div className="bg-card p-6 border-t border-border/10">
                  <Button
                    disabled
                    variant="outline"
                    className="w-full opacity-70"
                  >
                    Free Plan
                  </Button>
                </div>
                <div className="bg-card p-6 border-t border-border/10">
                  <Button
                    variant="outline"
                    className="w-full border-blue-500/30 hover:bg-blue-500/5 text-blue-600 font-medium transition-all duration-200"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Upgrade to Personal
                  </Button>
                </div>
                <div className="bg-card p-6 border-t border-border/10">
                  {isPro ? (
                    <Button disabled variant="outline" className="w-full">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Upgrade to Pro
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Annual Offer */}
      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium flex items-center">
              <span className="mr-2">✨</span>
              Save 20% with annual billing
            </h3>
            <p className="text-muted-foreground max-w-xl mt-1">
              Get Pro for $7.99/month when billed annually ($95.88/year).
              Includes all Pro features plus priority feature requests.
            </p>
          </div>
          <Button
            variant="outline"
            className="md:w-auto w-full border-green-500/30 hover:bg-green-500/5 text-green-600 font-medium transition-all duration-200"
          >
            <Zap className="mr-2 h-4 w-4" />
            Upgrade Annually
          </Button>
        </div>
      </div>
      {/* FAQ Section */}
      <div className="mt-12 mb-8">
        <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium">Can I change plans later?</h3>
            <p className="text-muted-foreground text-sm">
              Yes, you can upgrade, downgrade, or cancel your subscription at
              any time.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Is there a free trial?</h3>
            <p className="text-muted-foreground text-sm">
              We offer a free plan with basic features. You can upgrade anytime
              when you need more power.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">What payment methods do you accept?</h3>
            <p className="text-muted-foreground text-sm">
              We accept all major credit cards and PayPal.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">
              What happens to my data if I cancel?
            </h3>
            <p className="text-muted-foreground text-sm">
              You'll have 30 days to export your data before it's permanently
              deleted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

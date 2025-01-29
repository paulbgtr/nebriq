"use client";

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { ChevronLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { useRouter } from "next/navigation";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.replace("/")}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Last Updated: January 29, 2025
          </p>
        </CardHeader>

        <CardContent>
          <Alert className="mb-6">
            <AlertDescription>
              This Privacy Policy explains how we collect, use, and protect your
              information.
            </AlertDescription>
          </Alert>

          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <Separator className="mb-4" />
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Nebriq. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our
                web note-taking application.
              </p>
            </section>

            {/* Information Collection */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Information We Collect
              </h2>
              <Separator className="mb-4" />
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Email address</li>
                <li>Payment information</li>
                <li>Notes and content you create</li>
                <li>Usage data and analytics</li>
                <li>Technical information about your device and browser</li>
              </ul>
            </section>

            {/* Information Usage */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                How We Use Your Information
              </h2>
              <Separator className="mb-4" />
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="usage">
                  <AccordionTrigger>Primary Uses</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Account creation and authentication</li>
                      <li>Providing note-taking services</li>
                      <li>Cloud storage and synchronization</li>
                      <li>AI-powered note analysis and enhancement</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="additional">
                  <AccordionTrigger>Additional Uses</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Service improvement and analytics</li>
                      <li>Processing payments</li>
                      <li>Communication about service updates</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Data Storage */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Data Storage and Retention
              </h2>
              <Separator className="mb-4" />
              <Alert>
                <AlertDescription>
                  Your data is stored securely on Supabase servers and retained
                  until account deletion.
                </AlertDescription>
              </Alert>
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Secure storage on Supabase servers</li>
                    <li>Data retained until account/note deletion</li>
                    <li>Permanent removal upon account deletion</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Third-Party Services
              </h2>
              <Separator className="mb-4" />
              <p className="text-muted-foreground mb-4">We share data with:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>OpenAI (ChatGPT API) for AI-powered note analysis</li>
                <li>Payment processors for handling transactions</li>
              </ul>
            </section>

            {/* User Rights */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <Separator className="mb-4" />
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="gdpr">
                  <AccordionTrigger>GDPR Rights</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Access your personal data</li>
                      <li>Correct inaccurate personal data</li>
                      <li>Delete your account and associated data</li>
                      <li>Export your data</li>
                      <li>Modify your email and password</li>
                      <li>Withdraw consent for data processing</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Security */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <Separator className="mb-4" />
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>HTTPS encryption</li>
                <li>Secure data storage</li>
                <li>Regular security updates</li>
                <li>Access controls and authentication</li>
              </ul>
            </section>

            {/* Legal Sections */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Legal Information</h2>
              <Separator className="mb-4" />
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="transfers">
                  <AccordionTrigger>
                    International Data Transfers
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      As a company based in Estonia, we process and store data
                      in compliance with EU data protection laws (GDPR).
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="changes">
                  <AccordionTrigger>Changes to Privacy Policy</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      We may update this Privacy Policy periodically. We will
                      notify you of any material changes via email or through
                      the application.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="basis">
                  <AccordionTrigger>Legal Basis</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Contract performance</li>
                      <li>Legal obligations</li>
                      <li>Legitimate interests</li>
                      <li>Your consent</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                9. Contact Information
              </h2>
              <Separator className="mb-4" />
              <p className="text-muted-foreground">
                For questions about these Terms, contact us at{" "}
                <Button variant="link" className="p-0 h-auto font-normal">
                  hi@nebriq.com
                </Button>
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

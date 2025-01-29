"use client";

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function TermsOfService() {
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
      <Card className="shadow-sm">
        <CardHeader className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last Updated: January 29, 2025
          </p>
        </CardHeader>

        <CardContent>
          <Alert className="mb-6">
            <AlertDescription>
              By using Nebriq, you agree to these terms. Please read them
              carefully.
            </AlertDescription>
          </Alert>

          <div className="space-y-8">
            {/* Introduction Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <Separator className="mb-4" />
              <p className="text-muted-foreground leading-relaxed">
                Welcome to Nebriq. By accessing or using our web application,
                you agree to be bound by these Terms of Service ("Terms"). If
                you disagree with any part of these terms, you may not access
                our service.
              </p>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. Service Description
              </h2>
              <Separator className="mb-4" />
              <p className="text-muted-foreground leading-relaxed">
                Nebriq is a web application designed for researchers, students,
                scholars, writers, and tech writers to manage and enhance their
                work through AI-powered features.
              </p>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. Account Registration and Security
              </h2>
              <Separator className="mb-4" />
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  To use Nebriq, you must comply with the following
                  requirements:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide a valid email address and create a password</li>
                  <li>Maintain the confidentiality of your account</li>
                  <li>Be at least 18 years old</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>
              </div>
            </section>

            {/* User Rights and Responsibilities */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                4. User Rights and Responsibilities
              </h2>
              <Separator className="mb-4" />
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="rights">
                  <AccordionTrigger>User Rights</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Create, edit, view, and delete their content</li>
                      <li>Access AI features based on subscription status</li>
                      <li>Manage account settings and preferences</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="responsibilities">
                  <AccordionTrigger>User Responsibilities</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Do not share account credentials</li>
                      <li>Do not upload malicious content</li>
                      <li>Do not engage in unauthorized access</li>
                      <li>Do not post inappropriate content</li>
                      <li>Respect intellectual property rights</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Service Plans and Billing */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                5. Service Plans and Billing
              </h2>
              <Separator className="mb-4" />
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Free Plan</h3>
                  <p className="text-muted-foreground">
                    Limited number of notes and basic features
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Pro Subscription</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      Full access to all features including AI capabilities
                    </li>
                    <li>Monthly and yearly billing options</li>
                    <li>Non-refundable unless required by law</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Content Guidelines */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                6. Content Guidelines
              </h2>
              <Separator className="mb-4" />
              <Alert className="mb-4">
                <AlertDescription>
                  You retain ownership of your content, but must follow these
                  guidelines.
                </AlertDescription>
              </Alert>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>No illegal or harmful content</li>
                <li>No intellectual property infringement</li>
                <li>No malware or malicious code</li>
                <li>No privacy violations</li>
                <li>No explicit material</li>
              </ul>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
              <Separator className="mb-4" />
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We reserve the right to terminate or suspend access
                  immediately for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Terms violations</li>
                  <li>Prohibited activities</li>
                  <li>Non-payment</li>
                </ul>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                8. Changes to Terms
              </h2>
              <Separator className="mb-4" />
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Users
                will be notified of material changes via email or through the
                service.
              </p>
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

            {/* Legal Sections */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                10. Legal Information
              </h2>
              <Separator className="mb-4" />
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="warranties">
                  <AccordionTrigger>Disclaimer of Warranties</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      The service is provided "as is" without warranties of any
                      kind, either express or implied.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="liability">
                  <AccordionTrigger>Limitation of Liability</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      To the maximum extent permitted by law, Nebriq shall not
                      be liable for any indirect, incidental, special,
                      consequential, or punitive damages.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="law">
                  <AccordionTrigger>Governing Law</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      These Terms shall be governed by and construed in
                      accordance with the laws of Estonia.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Final Note */}
            <Alert className="mt-8">
              <AlertDescription>
                By using Nebriq, you acknowledge that you have read, understood,
                and agree to be bound by these Terms of Service.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Mail } from "lucide-react";

export default function HelpCenter() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Quick Contact */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-2xl font-bold">Need Help?</h1>
            <p className="text-muted-foreground">
              The fastest way to get help is to email us directly
            </p>
            <Button asChild>
              <a
                href="mailto:hi@nebriq.com"
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email Us
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="what">
            <AccordionTrigger>What is Nebriq?</AccordionTrigger>
            <AccordionContent>
              Nebriq is an AI-powered note-taking app designed for researchers,
              students, and writers.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="free">
            <AccordionTrigger>Is there a free plan?</AccordionTrigger>
            <AccordionContent>
              Yes, Nebriq offers a free plan with basic features. Premium
              features are available with a Pro subscription.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="data">
            <AccordionTrigger>How secure is my data?</AccordionTrigger>
            <AccordionContent>
              Your data is encrypted and securely stored on Supabase servers. We
              follow industry best practices for data protection.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cancel">
            <AccordionTrigger>
              How do I cancel my subscription?
            </AccordionTrigger>
            <AccordionContent>
              You can cancel your subscription anytime from your account
              settings. Your access will continue until the end of your billing
              period.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="export">
            <AccordionTrigger>Can I export my notes?</AccordionTrigger>
            <AccordionContent>
              Yes, you can export your notes in multiple formats including
              Markdown and PDF.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Quick Links */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Useful Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Legal</h3>
              <div className="space-y-2">
                <Button variant="link" className="h-auto p-0" asChild>
                  <a href="/terms">Terms of Service</a>
                </Button>
                <br />
                <Button variant="link" className="h-auto p-0" asChild>
                  <a href="/privacy">Privacy Policy</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Connect</h3>
              <div className="space-y-2">
                <Button variant="link" className="h-auto p-0" asChild>
                  <a href="https://x.com/getnebriq" target="_blank">
                    Twitter
                  </a>
                </Button>
                <br />
                <Button variant="link" className="h-auto p-0" asChild>
                  <a href="https://microlaunch.net/p/nebriq" target="_blank">
                    Microlaunch
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { useUser } from "@/shared/hooks/use-user";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Welcome to Nebriq",
    description: "Let's get you started with a clean writing space",
    action: "Next",
  },
  {
    title: "Just Write",
    description: "No folders needed. Start writing and we'll handle the rest",
    action: "Next",
  },
  {
    title: "Smart Search",
    description: "Find anything instantly with AI-powered search",
    action: "Next",
  },
  {
    title: "Meet Briq",
    description:
      "Your AI assistant is here to help analyze and connect your notes",
    action: "Get Started",
  },
];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(true);
  const { user } = useUser();

  const handleComplete = () => {
    if (!user) return;

    setOpen(false);
    localStorage.setItem(`onboarding-${user.id}`, "completed");
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogTitle className="text-xl">{steps[step].title}</DialogTitle>
          <DialogDescription className="text-base mt-2">
            {steps[step].description}
          </DialogDescription>

          <div className="flex gap-1 justify-center py-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  i === step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          <div className="flex justify-end gap-2">
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)}>
                {steps[step].action}
              </Button>
            ) : (
              <Button onClick={handleComplete}>Get Started</Button>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

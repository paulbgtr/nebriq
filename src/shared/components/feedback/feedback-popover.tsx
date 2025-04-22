"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useState, useEffect } from "react";
import { MessageSquarePlus, Send, Loader2 } from "lucide-react";
import { sendEmail } from "@/app/actions/emails/send-email";
import { useUser } from "@/shared/hooks/data/use-user";
import { useToast } from "@/shared/hooks/use-toast";
import { EmailTemplate } from "@/enums/email-template";
import { Badge } from "@/shared/components/ui/badge";
import { motion } from "framer-motion";

const EMOJI_OPTIONS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "🤔", label: "Confused" },
  { emoji: "😕", label: "Concerned" },
  { emoji: "💡", label: "Suggestion" },
  { emoji: "🐛", label: "Bug" },
  { emoji: "🔥", label: "Hot" },
] as const;

type FeedbackPopoverProps = {
  children?: React.ReactNode;
};

const STORAGE_KEY = "feedback_last_submission_time";
const MIN_CHARS = 10;
const MAX_CHARS = 500;

export const FeedbackPopover = ({ children }: FeedbackPopoverProps) => {
  const { user } = useUser();
  const { toast } = useToast();

  const [feedback, setFeedback] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });

  // Check and update cooldown timer
  useEffect(() => {
    if (!isOpen) return;

    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime;

    if (timeSinceLastSubmission < 60000) {
      setCooldownRemaining(Math.ceil((60000 - timeSinceLastSubmission) / 1000));

      const interval = setInterval(() => {
        setCooldownRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, lastSubmissionTime]);

  const handleSubmit = async () => {
    if (cooldownRemaining > 0) {
      toast({
        title: "Please wait",
        description: `You can submit feedback again in ${cooldownRemaining} seconds`,
        variant: "destructive",
      });
      return;
    }

    if (feedback.trim().length < MIN_CHARS) {
      toast({
        title: "Feedback too short",
        description: `Please provide more detailed feedback (minimum ${MIN_CHARS} characters)`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const emailTitle = "Feedback on Nebriq";
    const projectEmail = "hi@nebriq.com";

    try {
      await sendEmail(
        emailTitle,
        projectEmail,
        projectEmail,
        EmailTemplate.FEEDBACK,
        {
          email: user?.email || "Anonymous User",
          message: feedback,
          emoji: selectedEmoji || undefined,
        }
      );

      const newSubmissionTime = Date.now();
      setLastSubmissionTime(newSubmissionTime);
      localStorage.setItem(STORAGE_KEY, newSubmissionTime.toString());

      setFeedback("");
      setSelectedEmoji(null);
      setIsOpen(false);

      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast({
        title: "Error submitting feedback",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = feedback.trim().length;
  const isValidLength = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 hover:bg-muted/80 transition-colors"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Feedback</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 overflow-hidden shadow-lg border-muted">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 border-b">
          <h3 className="font-semibold text-lg">Share your feedback</h3>
          <p className="text-sm text-muted-foreground">
            Help us improve Nebriq with your thoughts and suggestions
          </p>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {EMOJI_OPTIONS.map((option) => (
              <motion.button
                key={option.emoji}
                onClick={() => setSelectedEmoji(option.emoji)}
                className={`p-2.5 rounded-full transition-all ${
                  selectedEmoji === option.emoji
                    ? "bg-primary/10 ring-2 ring-primary/50 scale-110"
                    : "hover:bg-muted hover:scale-105"
                }`}
                title={option.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">{option.emoji}</span>
              </motion.button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="feedback-text" className="text-sm font-medium">
                Your message
              </label>
              <Badge
                variant={isValidLength ? "outline" : "destructive"}
                className="text-xs font-normal"
              >
                {charCount}/{MAX_CHARS}
              </Badge>
            </div>
            <Textarea
              id="feedback-text"
              placeholder="Share your thoughts with us..."
              value={feedback}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setFeedback(e.target.value);
                }
              }}
              className="min-h-[120px] resize-none focus-visible:ring-primary/50"
            />
          </div>

          {cooldownRemaining > 0 && (
            <div className="text-sm text-amber-600 flex items-center gap-2 justify-center">
              <Loader2 className="w-3 h-3 animate-spin" />
              Please wait {cooldownRemaining}s before submitting again
            </div>
          )}

          <Button
            className="w-full gap-2 group"
            onClick={handleSubmit}
            disabled={
              !feedback.trim() ||
              isSubmitting ||
              !isValidLength ||
              cooldownRemaining > 0
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                Send Feedback
              </>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { sendEmail } from "@/app/actions/emails/send-email";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/shared/hooks/use-toast";
import { EmailTemplate } from "@/enums/email-template";

const EMOJI_OPTIONS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "🤔", label: "Confused" },
  { emoji: "😕", label: "Concerned" },
  { emoji: "💡", label: "Suggestion" },
  { emoji: "🐛", label: "Bug" },
] as const;

type FeedbackPopoverProps = {
  children?: React.ReactNode;
};

const STORAGE_KEY = "feedback_last_submission_time";

export const FeedbackPopover = ({ children }: FeedbackPopoverProps) => {
  const { user } = useUser();
  const { toast } = useToast();

  const [feedback, setFeedback] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? parseInt(stored, 10) : 0;
    }
    return 0;
  });

  const handleSubmit = async () => {
    const now = Date.now();
    if (now - lastSubmissionTime < 60000) {
      const remainingSeconds = Math.ceil(
        (60000 - (now - lastSubmissionTime)) / 1000
      );
      toast({
        title: "Please wait",
        description: `You can submit feedback again in ${remainingSeconds} seconds`,
        variant: "destructive",
      });
      return;
    }

    if (feedback.trim().length < 10) {
      toast({
        title: "Feedback too short",
        description:
          "Please provide more detailed feedback (minimum 10 characters)",
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageSquarePlus className="w-4 h-4" />
            <span>Feedback</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="flex gap-2 justify-center">
            {EMOJI_OPTIONS.map((option) => (
              <button
                key={option.emoji}
                onClick={() => setSelectedEmoji(option.emoji)}
                className={`p-2 rounded-lg hover:bg-muted transition-colors ${
                  selectedEmoji === option.emoji ? "bg-muted" : ""
                }`}
                title={option.label}
              >
                <span className="text-xl">{option.emoji}</span>
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Share your thoughts with us... (minimum 10 characters)"
            value={feedback}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFeedback(e.target.value)
            }
            className="min-h-[100px]"
          />
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={
              !feedback.trim() || isSubmitting || feedback.trim().length < 10
            }
          >
            {isSubmitting ? "Sending..." : "Send Feedback"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

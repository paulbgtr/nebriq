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

export const FeedbackPopover = ({ children }: FeedbackPopoverProps) => {
  const { user } = useUser();
  const { toast } = useToast();

  const [feedback, setFeedback] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const handleSubmit = async () => {
    const emailTitle = "Feedback on Nebriq";
    const projectEmail = "hi@nebriq.com";

    try {
      await sendEmail(
        emailTitle,
        projectEmail,
        projectEmail,
        <div>
          <h1>Feedback from {user?.email || "Anonymous User"}</h1>
          <p>{feedback}</p>
        </div>
      );

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
            placeholder="Share your thoughts with us..."
            value={feedback}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFeedback(e.target.value)
            }
            className="min-h-[100px]"
          />
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!feedback.trim()}
          >
            Send Feedback
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

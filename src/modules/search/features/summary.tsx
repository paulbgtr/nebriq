import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Sparkle } from "lucide-react";
import { useTypewriter } from "@/hooks/use-typewriter";
import { Button } from "@/shared/components/ui/button";
import { useSummary } from "@/hooks/use-sumary";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { Skeleton } from "@/shared/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import { cn } from "@/shared/lib/utils";

type Props = {
  results: z.infer<typeof noteSchema>[];
};

const fadeInAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const skeletonAnimation = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 },
};

export const Summary = ({ results }: Props) => {
  const params = useParams();
  const query = decodeURIComponent(params.query as string);

  const { summary, setIsSummarized, isLoadingSummary } = useSummary(
    results,
    query
  );
  const displayedText = useTypewriter(summary ?? "", 25).displayedText;

  if (!summary && !isLoadingSummary) {
    return (
      <Button onClick={() => setIsSummarized(true)} variant="outline">
        <Sparkle className="w-4 h-4 mr-2" />
        Summarize
      </Button>
    );
  }

  return (
    <motion.div className="w-full max-w-4xl mx-auto" {...fadeInAnimation}>
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-border">
        <div className={cn("p-2.5 rounded-lg", "bg-primary/10")}>
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">AI Summary</h3>
          <p className="text-sm text-muted-foreground">
            Generated based on your notes and query
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoadingSummary ? (
          <motion.div className="space-y-4" {...skeletonAnimation}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[92%]" />
                <Skeleton className="h-4 w-[88%]" />
              </div>
            ))}
          </motion.div>
        ) : (
          <div
            className={cn(
              "prose prose-sm max-w-none",
              "text-muted-foreground/90"
            )}
          >
            <ReactMarkdown className="leading-relaxed">
              {displayedText}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
};

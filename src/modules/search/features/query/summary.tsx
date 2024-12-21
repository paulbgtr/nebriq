import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTypewriter } from "@/hooks/use-typewriter";
import { Button } from "@/shared/components/ui/button";
import { Sparkle } from "lucide-react";
import { useSummary } from "@/hooks/use-sumary";
import { Note } from "@/types/note";
import { Skeleton } from "@/shared/components/ui/skeleton";
import ReactMarkdown from "react-markdown";

type Props = {
  results: Note[];
};

export const Summary = ({ results }: Props) => {
  const { summary, setIsSummarized, isLoadingSummary } = useSummary(results);

  const displayedText = useTypewriter(summary ?? "", 25).displayedText;

  return (
    <>
      {summary || isLoadingSummary ? (
        <div className="w-full">
          <motion.div
            className="p-6 bg-white rounded-lg min-h-[200px] overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-2 pb-3 border-b">
              <div className="p-2 bg-secondary rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Summary</h3>
                <p className="text-sm text-gray-500">
                  Generated based on your notes and query
                </p>
              </div>
            </div>
            {isLoadingSummary ? (
              <motion.div
                className="space-y-4 px-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[95%]" />
                </div>
              </motion.div>
            ) : (
              <div className="text-gray-700 leading-relaxed prose prose-sm rounded-lg p-4">
                <ReactMarkdown>{displayedText}</ReactMarkdown>
              </div>
            )}
          </motion.div>
        </div>
      ) : (
        <Button onClick={() => setIsSummarized(true)}>
          <Sparkle className="w-4 h-4" />
          Summarize
        </Button>
      )}
    </>
  );
};

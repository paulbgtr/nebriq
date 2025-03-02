import { Lightbulb } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";

const QUERY_EXAMPLES = [
  {
    icon: "🎯",
    text: "Create Quiz",
    description: "Generate interactive questions",
  },
  {
    icon: "📝",
    text: "Summarize",
    description: "Condense key points",
  },
  {
    icon: "📅",
    text: "Review",
    description: "Analyze and evaluate",
  },
  {
    icon: "🔍",
    text: "Find Gaps",
    description: "Identify missing elements",
  },
];

type Props = {
  setFollowUp: (followUp: string) => void;
};

/**
 * QueryExamples component.
 *
 * Display a list of example queries to get started with an enhanced visual design
 * and refined animations for better user experience.
 *
 * @param {Props} props Component props
 * @returns {JSX.Element} QueryExamples component
 */
export const QueryExamples = ({ setFollowUp }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-2xl mx-auto space-y-6 p-2"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={cn(
          "flex items-center gap-3",
          "px-3 py-2",
          "text-foreground/90",
          "border-b border-input/50",
          "mb-2"
        )}
      >
        <motion.div
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut",
          }}
          className="text-primary"
        >
          <Lightbulb className="w-5 h-5" />
        </motion.div>
        <span className="text-sm font-medium tracking-tight">
          Try asking about...
        </span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-1">
        {QUERY_EXAMPLES.map((example, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15 * (index + 1),
              duration: 0.4,
              ease: "easeOut",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setFollowUp(`${example.text}`);
            }}
            className={cn(
              "group",
              "px-4 py-3 w-full",
              "rounded-xl",
              "text-left",
              "bg-background/80",
              "border border-input/80",
              "hover:border-primary/50",
              "hover:bg-muted/60",
              "transition-all duration-150",
              "backdrop-blur-sm"
            )}
          >
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 25,
                  duration: 0.1,
                }}
                className="flex-shrink-0 text-primary/80 group-hover:text-primary transition-colors duration-150"
              >
                {example.icon}
              </motion.div>
              <div className="space-y-1 min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    "text-foreground/90",
                    "group-hover:text-primary",
                    "transition-colors duration-150"
                  )}
                >
                  {example.text}
                </p>
                <p className="text-xs text-muted-foreground/90 truncate line-clamp-1">
                  {example.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

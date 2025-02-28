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
 * Display a list of example queries to get started
 *
 * @param {Props} props Component props
 * @returns {JSX.Element} QueryExamples component
 */
export const QueryExamples = ({ setFollowUp }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "flex items-center gap-3",
          "px-1.5 py-1",
          "text-foreground/80",
          "border-b border-input/50"
        )}
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 4,
          }}
          className="text-primary/80"
        >
          <Lightbulb className="w-[18px] h-[18px]" />
        </motion.div>
        <span className="text-sm font-medium tracking-tight">
          Try asking about...
        </span>
      </motion.div>

      <div className="grid grid-cols-2 gap-2 px-1">
        {QUERY_EXAMPLES.map((example, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setFollowUp(`${example.text}`);
            }}
            className={cn(
              "group",
              "px-3 py-2.5 w-full",
              "rounded-lg",
              "text-left",
              "bg-background",
              "border border-input",
              "hover:border-primary/30",
              "hover:bg-muted/40",
              "transition-colors duration-200"
            )}
          >
            <div className="flex items-center gap-2">
              <motion.span
                className="text-lg"
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {example.icon}
              </motion.span>
              <div className="space-y-0.5 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    "text-foreground/90",
                    "group-hover:text-primary",
                    "transition-colors duration-200"
                  )}
                >
                  {example.text}
                </p>
                <p className="text-xs text-muted-foreground truncate">
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

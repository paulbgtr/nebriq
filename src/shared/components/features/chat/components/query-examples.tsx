import { Lightbulb } from "lucide-react";
import { cn } from "@/shared/lib/utils";

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
    <>
      <div className={cn("flex items-center gap-3 mb-6", "text-foreground")}>
        <div
          className={cn("p-2 rounded-full", "bg-primary/10", "animate-pulse")}
        >
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Get Started</h2>
          <p className="text-sm text-muted-foreground">
            Choose an example or type your own question
          </p>
        </div>
      </div>

      <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3", "relative")}>
        {QUERY_EXAMPLES.map((example, index) => (
          <button
            key={index}
            onClick={() => setFollowUp(`${example.icon} ${example.text}`)}
            className={cn(
              "group relative",
              "p-4 w-full",
              "rounded-xl",
              "text-left",

              "bg-background/50",
              "border border-secondary/20",
              "hover:border-primary/30",

              "shadow-sm",
              "hover:shadow-md hover:shadow-primary/5",

              "transition-all duration-300 ease-out",
              "hover:-translate-y-1",

              "before:absolute before:inset-0",
              "before:rounded-xl",
              "before:bg-gradient-to-br",
              "before:from-transparent before:to-primary/5",
              "before:opacity-0 before:transition-opacity",
              "hover:before:opacity-100"
            )}
          >
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{example.icon}</span>
                <span
                  className={cn(
                    "font-medium text-foreground",
                    "group-hover:text-primary"
                  )}
                >
                  {example.text}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {example.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
};

import { cn } from "@/shared/lib/utils";
import { LucideIcon, Brain, Book, Sparkles, Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { useNotes } from "@/shared/hooks/use-notes";

const QueryExample = ({
  icon: Icon,
  text,
  onClick,
}: {
  icon: LucideIcon;
  text: string;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={cn(
      "flex items-center gap-2",
      "px-3 py-2",
      "rounded-lg",
      "bg-muted/20 hover:bg-muted/30",
      "border border-border/20 hover:border-border/30",
      "transition-colors duration-200",
      "group"
    )}
  >
    <div className="text-primary/60 group-hover:text-primary/80 transition-colors">
      <Icon className="w-4 h-4" />
    </div>
    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
      {text}
    </span>
  </motion.button>
);

export const QueryExamples = ({
  onSelect,
}: {
  onSelect: (query: string) => void;
}) => {
  const { getNotesQuery } = useNotes();
  const notes = getNotesQuery.data || [];

  const examples = useMemo(() => {
    const staticExamples = [
      {
        icon: Brain,
        text: "Create Quiz",
        query: "Create a quiz from my notes",
      },
      { icon: Book, text: "Summarize", query: "Summarize my recent notes" },
    ];

    const dynamicExamples = [];

    const allTags = notes.flatMap((note) => note.tags || []);
    if (allTags.length > 0) {
      const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
      dynamicExamples.push({
        icon: Search,
        text: `Find ${randomTag}`,
        query: `Find notes about ${randomTag}`,
      });
    }

    const recentNote = notes[0];
    if (recentNote?.title) {
      dynamicExamples.push({
        icon: Sparkles,
        text: `Review`,
        query: `Explain the concepts in "${recentNote.title}"`,
      });
    }

    return [...staticExamples, ...dynamicExamples];
  }, [notes]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.1 }}
      className="flex flex-wrap items-center gap-2 mt-3 px-1"
    >
      {examples.map((example, i) => (
        <QueryExample
          key={i}
          icon={example.icon}
          text={example.text}
          onClick={() => onSelect(example.query)}
        />
      ))}
    </motion.div>
  );
};

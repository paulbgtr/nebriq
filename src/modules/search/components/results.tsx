import { NoteList } from "@/shared/components/note-list";
import { Spinner } from "@/shared/components/spinner";
import { motion, AnimatePresence } from "framer-motion";
import { noteSchema } from "@/shared/lib/schemas/note";
import { Frown, Search, FileText, ArrowRight } from "lucide-react";
import { Summary } from "../features/summary";
import { z } from "zod";
import { useSearchStore } from "@/store/search";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";

type ResultsProps = {
  results: z.infer<typeof noteSchema>[];
  hasSearched: boolean;
};

export const Results = ({ results, hasSearched }: ResultsProps) => {
  const { isAiSearch } = useSearchStore();
  const router = useRouter();

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center py-16 px-6">
      <Frown className="w-20 h-20 text-muted-foreground/40 mb-8" />
      <h2 className="text-2xl font-bold text-foreground mb-4">
        No matches found
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
        We couldn&apos;t find any notes matching your search. Try:
      </p>
      <ul className="text-muted-foreground space-y-3 text-left mb-8">
        <li className="flex items-center gap-3 bg-muted/5 p-3 rounded-lg">
          <Search className="w-5 h-5 text-primary/40" />
          <span>Using different keywords or phrases</span>
        </li>
        <li className="flex items-center gap-3 bg-muted/5 p-3 rounded-lg">
          <FileText className="w-5 h-5 text-primary/40" />
          <span>Checking for typos in your search</span>
        </li>
      </ul>
      <Button
        onClick={() => router.push("/write")}
        variant="ghost"
        className="group"
      >
        Create a new note
        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <Spinner size="lg" />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-lg text-foreground font-medium"
      >
        Searching through your notes
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-muted-foreground mt-2"
      >
        This may take a few moments...
      </motion.p>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="w-full max-w-5xl mx-auto space-y-4 sm:space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {!hasSearched ? (
          <LoadingState />
        ) : results.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            className="space-y-4 sm:space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
                Results
                <span className="text-xs sm:text-sm text-muted-foreground font-normal bg-muted/5 px-2 sm:px-3 py-1 rounded-full">
                  {results.length} notes found
                </span>
              </h3>
            </div>

            <div className="grid gap-4 sm:gap-6">
              <NoteList notes={results} />

              {isAiSearch && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-muted/5 rounded-lg p-4 sm:p-6"
                >
                  <Summary results={results} />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

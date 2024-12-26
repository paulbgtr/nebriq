import { NoteList } from "@/shared/components/note-list";
import { Spinner } from "@/shared/components/spinner";
import { motion, AnimatePresence } from "framer-motion";
import { noteSchema } from "@/shared/lib/schemas/note";
import { Frown, Search, FileText } from "lucide-react";
import { Summary } from "../features/summary";
import { z } from "zod";
import { useSearchStore } from "@/store/search";

type ResultsProps = {
  results: z.infer<typeof noteSchema>[];
  hasSearched: boolean;
};

export const Results = ({ results, hasSearched }: ResultsProps) => {
  const { isAiSearch } = useSearchStore();

  const EmptyState = () => (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[400px] text-center py-16 px-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Frown className="w-20 h-20 text-gray-400 mb-6 animate-bounce" />
      <h2 className="text-2xl font-bold text-gray-800 mb-3">
        No matches found
      </h2>
      <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
        We couldn't find any notes matching your search. Try:
      </p>
      <ul className="text-gray-600 mt-4 space-y-2 text-left">
        <li className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          Using different keywords
        </li>
        <li className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Checking for typos
        </li>
      </ul>
    </motion.div>
  );

  const LoadingState = () => (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[400px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Spinner size="lg" />
      <p className="mt-6 text-gray-600 font-medium">
        Searching through your notes
      </p>
      <p className="text-sm text-gray-500 mt-2">
        This may take a few moments...
      </p>
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="w-full max-w-5xl mx-auto px-4 py-8"
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
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                Search Results
                <span className="ml-3 text-lg text-gray-500 font-normal">
                  ({results.length} notes found)
                </span>
              </h3>
            </div>

            <div className="bg-white rounded-xl p-6">
              <NoteList notes={results} />
            </div>

            {isAiSearch && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Summary results={results} />
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

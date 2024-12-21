import { NoteList } from "@/shared/components/note-list";
import { Spinner } from "@/shared/components/spinner";
import { motion } from "framer-motion";
import { noteSchema } from "@/shared/lib/schemas/note";
import { Frown } from "lucide-react";
import { Summary } from "./summary";
import { z } from "zod";

import { useSearchStore } from "@/store/search";
type ResultsProps = {
  results: z.infer<typeof noteSchema>[];
  hasSearched: boolean;
};

export const Results = ({ results, hasSearched }: ResultsProps) => {
  const { isAiSearch } = useSearchStore();

  if (hasSearched && results.length === 0) {
    return (
      <motion.div
        className="text-center py-16 px-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Frown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          No results found
        </h2>
        <p className="text-gray-600 max-w-sm mx-auto">
          Try adjusting your search terms or using different keywords to find
          what you're looking for.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {hasSearched ? (
        <>
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Related Notes
          </h3>
          <NoteList notes={results.map((note) => note)} />
          <article className="flex justify-center">
            {isAiSearch && <Summary results={results} />}
          </article>
        </>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Spinner size="sm" />
          <p className="mt-4 text-gray-600 animate-pulse">
            Searching through your notes...
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

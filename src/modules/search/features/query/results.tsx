import { NoteList } from "@/shared/components/note-list";
import { Spinner } from "@/shared/components/spinner";
import { Note } from "@/types/note";
import { useTypewriter } from "@/hooks/use-typewriter";
import { motion } from "framer-motion";
import { LLMAnswer } from "@/types/llm-answer";
import { Frown, Sparkles, Search } from "lucide-react";
import parse from "html-react-parser";

type ResultsProps = {
  answer: Note[] | LLMAnswer;
  hasSearched: boolean;
};

export const Results = ({ answer, hasSearched }: ResultsProps) => {
  const displayedText = useTypewriter(
    (answer as LLMAnswer)?.answer ?? "",
    30
  ).displayedText;

  return (
    <motion.div
      className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {hasSearched ? (
        !Array.isArray(answer) ? (
          <article>
            {(answer as LLMAnswer).notes.length > 0 && (
              <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Related Notes
                </h3>
                <NoteList
                  notes={(answer as LLMAnswer).notes.map((note) => note)}
                />
              </motion.div>
            )}
            <div className="prose prose-lg max-w-none">
              <motion.div
                className="p-6 bg-white rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-2 pb-3 border-b">
                  <div className="p-2 bg-secondary rounded-lg">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI Response</h3>
                    <p className="text-sm text-gray-500">
                      Generated based on your notes and query
                    </p>
                  </div>
                </div>
                <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none rounded-lg p-4">
                  {parse(displayedText)}
                </div>
              </motion.div>
            </div>
          </article>
        ) : answer.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                <div className="p-2 bg-secondary rounded-lg">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Search Results
                  </h3>
                  <p className="text-sm text-gray-500">
                    Found {answer.length} matching{" "}
                    {answer.length === 1 ? "note" : "notes"}
                  </p>
                </div>
              </div>
              <NoteList notes={answer as Note[]} />
            </div>
          </motion.div>
        ) : (
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
              Try adjusting your search terms or using different keywords to
              find what you're looking for.
            </p>
          </motion.div>
        )
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

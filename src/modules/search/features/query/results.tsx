import { NoteList } from "@/shared/components/note-list";
import { Spinner } from "@/shared/components/spinner";
import { Note } from "@/types/note";
import { useTypewriter } from "@/hooks/use-typewriter";
import { motion } from "framer-motion";

type ResultsProps = {
  answer: Note[] | string;
  hasSearched: boolean;
};

export const Results = ({ answer, hasSearched }: ResultsProps) => {
  const { displayedText } =
    typeof answer === "string" ? useTypewriter(answer) : { displayedText: "" };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center">
        {hasSearched ? (
          <div className="w-full">
            {typeof answer === "string" ? (
              <div className="prose prose-xl max-w-3xl mx-auto flex justify-center">
                <motion.p
                  className="whitespace-pre-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {displayedText}
                </motion.p>
              </div>
            ) : Array.isArray(answer) && answer.length > 0 ? (
              <div className="max-w-4xl mx-auto">
                <NoteList notes={answer as any} />
              </div>
            ) : (
              <div className="text-center p-8 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-700">
                  No results found
                </h2>
                <p className="mt-2 text-gray-500">
                  Try adjusting your search terms or searching for something
                  else
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full py-16">
            <Spinner size="sm" />
            <p className="mt-2 text-center text-gray-500">
              Searching for notes...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

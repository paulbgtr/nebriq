import { NoteList } from "@/shared/components/note-list";
import { Spinner } from "@/shared/components/spinner";
import { Note } from "@/types/note";
import { useTypewriter } from "@/hooks/use-typewriter";
import { motion } from "framer-motion";
import { LLMAnswer } from "@/types/llm-answer";

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center">
        {hasSearched ? (
          <div className="w-full">
            {!Array.isArray(answer) ? (
              <div className="max-w-3xl mx-auto">
                {(answer as LLMAnswer).notes.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-gray-700">
                      Related notes
                    </h3>
                    <NoteList
                      notes={(answer as LLMAnswer).notes.map((note) => note)}
                    />
                  </div>
                )}
                <div className="prose prose-xl flex flex-col gap-4">
                  <motion.p
                    className="whitespace-pre-wrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {displayedText}
                  </motion.p>
                </div>
              </div>
            ) : answer.length > 0 ? (
              <div className="max-w-4xl mx-auto">
                <NoteList notes={answer as Note[]} />
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

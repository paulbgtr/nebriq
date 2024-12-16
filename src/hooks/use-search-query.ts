"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useNotes } from "@/hooks/use-notes";
import { searchUsingTFIDF } from "@/app/actions/search/tfidf";
import { Note } from "@/types/note";
import { useSearchStore } from "@/store/search";
import { llmAnswer } from "@/app/actions/search/ai-search";
import { LLMAnswer } from "@/types/llm-answer";
import { semanticSearch } from "@/app/actions/search/semantic-search";
import { useUser } from "./use-user";

type ReturnType = {
  answer: Note[] | LLMAnswer;
  hasSearched: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (e: React.FormEvent) => void;
};

export const useSearchQuery = (): ReturnType | null => {
  const { query } = useParams() as { query: string };
  const router = useRouter();
  const { isAiSearch } = useSearchStore();

  const { user } = useUser();

  if (!query) return null;

  const [searchQuery, setSearchQuery] = useState<string>(
    decodeURIComponent(query)
  );
  const [answer, setAnswer] = useState<Note[] | LLMAnswer>({
    answer: "",
    notes: [],
  });
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search/${encodeURIComponent(searchQuery)}`);
  };

  const { getNotesQuery } = useNotes();

  useEffect(() => {
    const notesData = getNotesQuery.data;

    if (!notesData) return;

    const fetchResults = async () => {
      try {
        if (isAiSearch && user) {
          const results = await semanticSearch(searchQuery, notesData);
          const answer = await llmAnswer(searchQuery, results, user.id);
          setAnswer(answer || null);
          setHasSearched(true);
          return;
        }

        const results = await searchUsingTFIDF(searchQuery, notesData);

        setAnswer(results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setHasSearched(true);
      }
    };

    fetchResults();
  }, [query, getNotesQuery.data, isAiSearch, setAnswer, setHasSearched]);

  return {
    answer,
    hasSearched,
    searchQuery,
    setSearchQuery,
    handleSearch,
  };
};

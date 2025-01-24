"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useNotes } from "@/hooks/use-notes";
import { searchUsingTFIDF } from "@/app/actions/search/tfidf";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { useSearchStore } from "@/store/search";
import { semanticSearch } from "@/app/actions/search/semantic-search";
import { useUser } from "./use-user";

type ReturnType = {
  results: z.infer<typeof noteSchema>[];
  hasSearched: boolean;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (e: React.FormEvent) => void;
};

/**
 * Combines search results from semantic search and TF-IDF search.
 * @param semanticResults - results from semantic search
 * @param tfidfResults - results from TF-IDF search
 * @returns combined search results, with semantic results prioritized
 */
const combineSearchResults = (
  semanticResults: z.infer<typeof noteSchema>[],
  tfidfResults: z.infer<typeof noteSchema>[]
): z.infer<typeof noteSchema>[] => {
  const uniqueResults = new Map();

  semanticResults.forEach((note, index) => {
    uniqueResults.set(note.id, {
      ...note,
      score: (semanticResults.length - index) * 1.2,
    });
  });

  tfidfResults.forEach((note, index) => {
    if (!uniqueResults.has(note.id)) {
      uniqueResults.set(note.id, {
        ...note,
        score: tfidfResults.length - index,
      });
    }
  });

  return Array.from(uniqueResults.values())
    .sort((a, b) => b.score - a.score)
    .map(({ ...note }) => note);
};

export const useSearchQuery = (): ReturnType | null => {
  const { query } = useParams() as { query: string };
  const router = useRouter();
  const { isAiSearch } = useSearchStore();

  const { user } = useUser();

  const [searchQuery, setSearchQuery] = useState<string>(
    decodeURIComponent(query)
  );
  const [results, setResults] = useState<z.infer<typeof noteSchema>[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search/${encodeURIComponent(searchQuery)}`);
  };

  const { getNotesQuery } = useNotes();

  useEffect(() => {
    const notesData = getNotesQuery.data;

    if (!notesData) return;

    const fetchResults = async (): Promise<void> => {
      try {
        let notes: z.infer<typeof noteSchema>[] = [];

        const tfidfResults = await searchUsingTFIDF(searchQuery, notesData);

        if (isAiSearch && user) {
          const semanticResults = await semanticSearch(searchQuery, notesData);

          notes = combineSearchResults(semanticResults, tfidfResults);
        } else {
          notes = tfidfResults;
        }

        setResults(notes);
        setHasSearched(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
        setHasSearched(true);
      }
    };

    fetchResults();
  }, [query, isAiSearch, setResults, setHasSearched]);

  if (!query) return null;

  return {
    results,
    hasSearched,
    searchQuery,
    setSearchQuery,
    handleSearch,
  };
};

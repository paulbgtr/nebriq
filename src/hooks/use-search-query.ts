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
import { useQuery } from "@tanstack/react-query";

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

  const searchResultsQuery = useQuery({
    queryKey: ["search-results", query, isAiSearch],
    queryFn: async () => {
      const notesData = getNotesQuery.data;
      if (!notesData) return [] as z.infer<typeof noteSchema>[];

      try {
        let notes: z.infer<typeof noteSchema>[] = [];

        const tfidfResults = await searchUsingTFIDF(searchQuery, notesData);
        setResults(tfidfResults);

        if (isAiSearch && user) {
          const semanticResults = await semanticSearch(searchQuery, notesData);
          notes = combineSearchResults(semanticResults, tfidfResults);
        } else {
          notes = tfidfResults;
        }

        return notes;
      } catch (error) {
        console.error("Error fetching search results:", error);
        return [] as z.infer<typeof noteSchema>[];
      }
    },
    enabled: !!query && !!getNotesQuery.data,
    gcTime: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (searchResultsQuery.data) {
      setResults(searchResultsQuery.data);
      setHasSearched(true);
    }
  }, [searchResultsQuery.data]);

  if (!query) return null;

  return {
    results,
    hasSearched,
    searchQuery,
    setSearchQuery,
    handleSearch,
  };
};

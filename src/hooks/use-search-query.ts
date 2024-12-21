"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useNotes } from "@/hooks/use-notes";
import { searchUsingTFIDF } from "@/app/actions/search/tfidf";
import { Note } from "@/types/note";
import { useSearchStore } from "@/store/search";
import { semanticSearch } from "@/app/actions/search/semantic-search";
import { useUser } from "./use-user";

type ReturnType = {
  results: Note[];
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
  const [results, setResults] = useState<Note[]>([]);
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
      let notes: Note[] = [];

      try {
        if (isAiSearch && user) {
          notes = await semanticSearch(searchQuery, notesData);
          return;
        }

        notes = await searchUsingTFIDF(searchQuery, notesData);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setResults(notes);
        setHasSearched(true);
      }
    };

    fetchResults();
  }, [query, isAiSearch, setResults, setHasSearched]);

  return {
    results,
    hasSearched,
    searchQuery,
    setSearchQuery,
    handleSearch,
  };
};

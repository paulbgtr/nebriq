"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useNotes } from "@/hooks/use-notes";
import { searchUsingTFIDF } from "@/app/actions/search/tfidf";
import { convertTFIDFToNotesWithDefaults } from "@/shared/lib/utils";
import { Note } from "@/types/note";

export const useSearchQuery = () => {
  const { query } = useParams() as { query: string };
  const router = useRouter();

  if (!query) return null;

  const [searchQuery, setSearchQuery] = useState<string>(
    decodeURIComponent(query)
  );
  const [notes, setNotes] = useState<Note[]>([]);
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
      const results = await searchUsingTFIDF(searchQuery, notesData);

      const convertedNotes = convertTFIDFToNotesWithDefaults(results);

      setNotes(convertedNotes);

      setHasSearched(true);
    };

    fetchResults();
  }, [query, getNotesQuery.data, setNotes, setHasSearched]);

  return {
    notes,
    hasSearched,
    searchQuery,
    setSearchQuery,
    handleSearch,
  };
};

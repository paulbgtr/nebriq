"use client";

import { useState } from "react";
import { SearchBar } from "./searchbar";
import { Note } from "@/types/note";
import { searchUsingTFIDF } from "@/app/actions/search/tfidf";
import { useNotes } from "@/hooks/use-notes";
import { NoteList } from "@/shared/components/note-list";
import { convertTFIDFToNotesWithDefaults } from "@/shared/lib/utils";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const { getNotesQuery } = useNotes();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const notesData = getNotesQuery.data;

    if (!notesData) return;

    const results = await searchUsingTFIDF(searchQuery, notesData);

    const convertedNotes = convertTFIDFToNotesWithDefaults(results);

    setNotes(convertedNotes);

    setHasSearched(true);
  };

  const handleSearchQueryChange = (newQuery: string) => {
    setSearchQuery(newQuery);
    setHasSearched(false);
  };

  return (
    <>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={handleSearchQueryChange}
        handleSearch={handleSearch}
      />

      {hasSearched && (
        <div className="pt-8">
          {notes.length > 0 ? (
            <NoteList notes={notes} />
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700">
                No results found
              </h2>
              <p className="mt-2 text-gray-500">
                Try adjusting your search terms or searching for something else
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

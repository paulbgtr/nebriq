"use client";

import SearchBar from "@/shared/components/search-bar";
import { Results } from "./results";
import { useSearchQuery } from "@/hooks/use-search-query";

export default function SearchQuery() {
  const searchQueryResult = useSearchQuery();

  if (!searchQueryResult) return null;

  const { results, hasSearched, searchQuery, setSearchQuery, handleSearch } =
    searchQueryResult;

  return (
    <div className="flex flex-col gap-4">
      <Results results={results} hasSearched={hasSearched} />
      <div className="fixed bottom-5 left-0 right-0 max-w-xl mx-auto">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      </div>
    </div>
  );
}

"use client";

import { Results } from "./components/results";
import { useSearchQuery } from "@/hooks/use-search-query";

export default function SearchQuery() {
  const searchQueryResult = useSearchQuery();

  if (!searchQueryResult) return null;

  const { results, hasSearched } = searchQueryResult;

  return (
    <div className="relative flex flex-col gap-6 px-4 py-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        <Results results={results} hasSearched={hasSearched} />
      </div>
    </div>
  );
}

"use client";

import { Results } from "./results";
import { useSearchQuery } from "@/hooks/use-search-query";
import FollowUp from "./follow-up";

export default function SearchQuery() {
  const searchQueryResult = useSearchQuery();

  if (!searchQueryResult) return null;

  const { results, hasSearched } = searchQueryResult;

  return (
    <div className="flex flex-col gap-4">
      <Results results={results} hasSearched={hasSearched} />
      {results.length > 0 && (
        <div className="fixed bottom-5 left-0 right-0 max-w-xl mx-auto">
          <FollowUp relevantNotes={results} />
        </div>
      )}
    </div>
  );
}

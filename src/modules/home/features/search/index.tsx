"use client";

import { useState } from "react";
import SearchBar from "@/shared/components/search-bar";
import { useRouter } from "next/navigation";
import { Sparkle } from "lucide-react";
import { useSearchHistory } from "@/hooks/use-search-history";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const { createSearchHistoryMutation } = useSearchHistory();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    await createSearchHistoryMutation.mutateAsync({
      query: searchQuery,
    });

    router.push(`/search/${encodeURIComponent(searchQuery)}`);
  };

  const handleSearchQueryChange = (newQuery: string) => {
    setSearchQuery(newQuery);
  };

  return (
    <article className="h-full items-center">
      <div
        className={`transition-all duration-500 ease-in-out w-full max-w-xl mx-auto`}
      >
        <div className="mb-6 text-center space-y-2">
          <div className="flex justify-center mb-3">
            <Sparkle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            Search your knowledge base
          </h1>
        </div>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={handleSearchQueryChange}
          handleSearch={handleSearch}
        />
      </div>
    </article>
  );
}

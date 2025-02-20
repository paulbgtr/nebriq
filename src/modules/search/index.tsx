"use client";

import { Results } from "./components/results";
import { useSearchQuery } from "@/hooks/use-search-query";
import { motion } from "framer-motion";
import SearchBar from "@/shared/components/search-bar";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

export default function SearchQuery() {
  const searchQueryResult = useSearchQuery();
  const params = useParams();
  const router = useRouter();

  const urlQuery =
    typeof params?.query === "string" ? decodeURIComponent(params.query) : "";
  const [searchQuery, setSearchQuery] = useState(urlQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/search/${encodeURIComponent(trimmedQuery)}`);
    }
  };

  if (!searchQueryResult) return null;

  const { results, hasSearched } = searchQueryResult;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-[calc(100vh-8rem)]"
    >
      <div className="relative flex flex-col gap-4 sm:gap-6 px-2 sm:px-4 py-4 sm:py-8 max-w-7xl mx-auto">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          variant="minimal"
        />
        <Results results={results} hasSearched={hasSearched} />
      </div>
    </motion.div>
  );
}

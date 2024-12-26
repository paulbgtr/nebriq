"use client";

import { Results } from "./results";
import { useSearchQuery } from "@/hooks/use-search-query";
import { motion } from "framer-motion";

export default function SearchQuery() {
  const searchQueryResult = useSearchQuery();

  if (!searchQueryResult) return null;

  const { results, hasSearched } = searchQueryResult;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex flex-col gap-6 px-4 py-6 max-w-3xl mx-auto"
    >
      <div className="space-y-6">
        <Results results={results} hasSearched={hasSearched} />
      </div>
    </motion.div>
  );
}

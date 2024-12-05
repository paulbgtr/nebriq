"use client";

import { useState } from "react";
import SearchBar from "@/shared/components/search-bar";
import { useRouter } from "next/navigation";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    router.push(`/search/${encodeURIComponent(searchQuery)}`);
  };

  const handleSearchQueryChange = (newQuery: string) => {
    setSearchQuery(newQuery);
  };

  return (
    <article className="grid h-full items-center">
      <div
        className={`transition-all duration-500 ease-in-out w-full max-w-md mx-auto`}
      >
        <div className="mb-6 text-center space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">
            What&apos;s on your mind?
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

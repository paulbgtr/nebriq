"use client";

import { useState } from "react";
import SearchBar from "@/shared/components/search-bar";
import { useRouter } from "next/navigation";
import { useSearchHistory } from "@/hooks/use-search-history";
import { motion } from "framer-motion";
import { useUser } from "@/hooks/use-user";
import { AnimatedCompass } from "@/modules/search/components/animated-compass";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { createSearchHistoryMutation } = useSearchHistory();

  const { user } = useUser();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    await createSearchHistoryMutation.mutateAsync({
      query: searchQuery,
      user_id: user.id,
    });
    router.push(`/search/${encodeURIComponent(searchQuery)}`);
  };

  const handleSearchQueryChange = (newQuery: string) => {
    setSearchQuery(newQuery);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.article
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
        <motion.div
          className="mb-4 sm:mb-6 md:mb-8 text-center space-y-2 sm:space-y-3"
          variants={itemVariants}
        >
          <AnimatedCompass />
          <motion.h1
            className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight"
            variants={itemVariants}
          >
            Discover Your Knowledge
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto"
            variants={itemVariants}
          >
            Search through your personal knowledge base instantly
          </motion.p>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={handleSearchQueryChange}
            handleSearch={handleSearch}
          />
        </motion.div>
      </div>
    </motion.article>
  );
}

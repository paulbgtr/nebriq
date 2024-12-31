"use client";

import { useState } from "react";
import SearchBar from "@/shared/components/search-bar";
import { useRouter } from "next/navigation";
import { Compass } from "lucide-react";
import { useSearchHistory } from "@/hooks/use-search-history";
import { motion } from "framer-motion";

const AnimatedCompass = () => {
  return (
    <div className="flex justify-center mb-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <motion.div
          animate={{
            y: [-2, 2],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              rotate: 15,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
          >
            <Compass className="w-10 h-10 text-primary" aria-hidden="true" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

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
      className="h-full items-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="w-full max-w-xl mx-auto">
        <motion.div
          className="mb-6 text-center space-y-2"
          variants={itemVariants}
        >
          <AnimatedCompass />
          <motion.h1
            className="text-xl font-semibold tracking-tight"
            variants={itemVariants}
          >
            Discover Your Knowledge
          </motion.h1>
        </motion.div>
        <motion.div variants={itemVariants}>
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

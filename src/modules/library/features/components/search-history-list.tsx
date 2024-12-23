import { z } from "zod";
import { searchHistoryItemSchema } from "@/shared/lib/schemas/search-history-item";
import SearchHistoryItem from "./search-history-item";

type SearchHistoryListProps = {
  searchHistory: z.infer<typeof searchHistoryItemSchema>[] | undefined;
};

export const SearchHistoryList = ({
  searchHistory,
}: SearchHistoryListProps) => {
  return (
    <>
      {searchHistory?.map((item) => (
        <SearchHistoryItem
          key={item.id}
          query={item.query}
          summary={item.summary ?? ""}
          timestamp={item.created_at}
        />
      ))}
    </>
  );
};

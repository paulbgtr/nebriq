import Link from "next/link";
import { formatDate } from "@/shared/lib/utils";

type SearchHistoryItemProps = {
  query: string;
  summary?: string;
  timestamp: Date;
};

const SearchHistoryItem: React.FC<SearchHistoryItemProps> = ({
  query,
  summary,
  timestamp,
}) => {
  const truncatedSummary = summary
    ? summary.length > 100
      ? summary.substring(0, 100) + "..."
      : summary
    : "";

  return (
    <Link style={{ textDecoration: "none" }} href={`/search/${query}`}>
      <div
        className="flex justify-between items-center p-4 border-b border-gray-200 hover:opacity-80 cursor-pointer duration-300"
        role="button"
        aria-label={`Search for ${query} on ${new Date(
          timestamp
        ).toLocaleString()}`}
      >
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-800">{query}</span>
          {summary && (
            <p className="text-sm text-gray-600">{truncatedSummary}</p>
          )}
          <time
            className="text-sm text-gray-500"
            dateTime={timestamp.toISOString()}
          >
            {formatDate(timestamp)}
          </time>
        </div>
      </div>
    </Link>
  );
};

export default SearchHistoryItem;

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
      ? `${summary.substring(0, 100)}...`
      : summary
    : "";

  return (
    <Link
      href={`/search/${encodeURIComponent(query)}`}
      className="block transition-all duration-200 hover:bg-gray-50"
    >
      <article
        className="group relative p-4 sm:p-6 border-b border-gray-200"
        role="button"
        aria-label={`Search for ${query} from ${new Date(
          timestamp
        ).toLocaleString()}`}
      >
        <div className="flex flex-col gap-2">
          <header className="flex items-start justify-between">
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary transition-colors">
              {query}
            </h3>
            <time
              className="hidden sm:block text-sm text-gray-500"
              dateTime={timestamp.toISOString()}
            >
              {formatDate(timestamp)}
            </time>
          </header>

          {summary && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {truncatedSummary}
            </p>
          )}

          <time
            className="block sm:hidden text-sm text-gray-500"
            dateTime={timestamp.toISOString()}
          >
            {formatDate(timestamp)}
          </time>
        </div>
      </article>
    </Link>
  );
};

export default SearchHistoryItem;

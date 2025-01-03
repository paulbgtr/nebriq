import Link from "next/link";
import { formatDate } from "@/shared/lib/utils";
import { cn } from "@/shared/lib/utils";

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
      className={cn(
        "block transition-colors duration-200",
        "hover:bg-muted/50"
      )}
    >
      <article
        className={cn("group relative p-4 sm:p-6", "border-b border-border")}
        role="button"
        aria-label={`Search for ${query} from ${new Date(
          timestamp
        ).toLocaleString()}`}
      >
        <div className="flex flex-col gap-2">
          <header className="flex items-start justify-between">
            <h3
              className={cn(
                "text-lg font-medium text-foreground",
                "group-hover:text-primary transition-colors"
              )}
            >
              {query}
            </h3>
            <time
              className="hidden sm:block text-sm text-muted-foreground"
              dateTime={timestamp.toISOString()}
            >
              {formatDate(timestamp)}
            </time>
          </header>

          {summary && (
            <p className="text-sm text-muted-foreground/80 line-clamp-2">
              {truncatedSummary}
            </p>
          )}

          <time
            className="block sm:hidden text-sm text-muted-foreground"
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

import { X } from "lucide-react";
import { Tabs, TabsList } from "@/shared/components/ui/tabs";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { useNoteTabsStore } from "@/store/note-tabs";
import { useSearchParams } from "next/navigation";
import { formatHTMLNoteContent } from "@/shared/lib/utils";

export const NoteTabs = () => {
  const searchParams = useSearchParams();
  const currentNoteId = searchParams.get("id");

  const { openNotes, setOpenNotes } = useNoteTabsStore();

  return (
    <Tabs className="w-full h-full" orientation="vertical">
      <TabsList className="h-full flex bg-background overflow-y-auto">
        {openNotes.map((note) => (
          <Link
            key={note.id}
            href={`/write?id=${note.id}`}
            className={cn(
              "group flex items-center justify-between w-full px-3 py-2 relative hover:bg-accent/50 rounded-sm transition-colors",
              note.id === currentNoteId && "bg-accent"
            )}
          >
            <div className="text-sm font-medium truncate min-w-0 flex-1">
              {note.title
                ? note.content
                  ? `${note.title} - ${formatHTMLNoteContent(
                      note.content
                    ).slice(0, 50)}...`
                  : note.title
                : "Untitled"}
            </div>
            <button
              className="ml-2 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-accent p-0.5 transition-opacity flex-shrink-0"
              onClick={(e) => {
                e.preventDefault();

                setOpenNotes(openNotes.filter((n) => n.id !== note.id));
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </Link>
        ))}
      </TabsList>
    </Tabs>
  );
};

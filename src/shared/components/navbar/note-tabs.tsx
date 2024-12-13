import { useNoteTabs } from "@/hooks/use-note-tabs";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Tabs, TabsList } from "@/shared/components/ui/tabs";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

export const NoteTabs = () => {
  const { getTabsQuery, deleteNoteTabMutation } = useNoteTabs();
  const searchParams = useSearchParams();
  const currentNoteId = searchParams.get("id");

  const notesTabs = getTabsQuery.data ?? [];

  return (
    <Tabs className="w-full max-w-[250px] h-full" orientation="vertical">
      <TabsList className="h-full flex flex-col bg-background overflow-y-auto">
        {notesTabs.map((noteTab) => (
          <Link
            key={noteTab.id}
            href={`/write?id=${noteTab.notes.id}`}
            className={cn(
              "group flex items-center justify-between w-full px-3 py-2 relative hover:bg-accent/50 rounded-sm transition-colors",
              noteTab.notes.id === currentNoteId && "bg-accent"
            )}
          >
            <div className="text-sm font-medium truncate min-w-0 flex-1">
              {noteTab.notes.title}
            </div>
            <button
              className="ml-2 rounded-sm opacity-0 group-hover:opacity-100 hover:bg-accent p-0.5 transition-opacity flex-shrink-0"
              onClick={(e) => {
                e.preventDefault();

                deleteNoteTabMutation.mutate(noteTab.id);
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

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SmartViewProps, SmartViewMode } from "../../types";
import {
  Clock,
  Tags,
  Sparkles,
  CalendarDays,
  ChevronRight,
  Zap,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { NoteList } from "@/shared/components/note-list";

export function SmartView({
  notes,
  viewMode,
  smartViewMode: initialSmartViewMode,
  isSelectionMode,
  onSelectionChange,
}: SmartViewProps) {
  const [smartViewMode, setSmartViewMode] = useState<SmartViewMode>(
    initialSmartViewMode || "recent"
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clusters = [
    {
      name: "Work Projects",
      icon: <BookOpen className="h-4 w-4" />,
      notes: notes
        .filter(
          (note) =>
            note.title?.toLowerCase().includes("work") ||
            note.content?.toLowerCase().includes("project")
        )
        .slice(0, 5),
    },
    {
      name: "Personal Ideas",
      icon: <Lightbulb className="h-4 w-4" />,
      notes: notes
        .filter(
          (note) =>
            note.title?.toLowerCase().includes("idea") ||
            note.content?.toLowerCase().includes("personal")
        )
        .slice(0, 5),
    },
    {
      name: "Learning Resources",
      icon: <Zap className="h-4 w-4" />,
      notes: notes
        .filter(
          (note) =>
            note.title?.toLowerCase().includes("learn") ||
            note.content?.toLowerCase().includes("resource")
        )
        .slice(0, 5),
    },
  ];

  const viewModes: {
    id: SmartViewMode;
    label: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      id: "recent",
      label: "Recent",
      icon: <Clock className="h-4 w-4" />,
      description: "Your most recently updated notes",
    },
    {
      id: "tags",
      label: "Tag Cloud",
      icon: <Tags className="h-4 w-4" />,
      description: "Browse notes by tags",
    },
    {
      id: "ai",
      label: "Smart Clusters",
      icon: <Sparkles className="h-4 w-4" />,
      description: "AI-generated clusters of related notes",
    },
    {
      id: "timeline",
      label: "Timeline",
      icon: <CalendarDays className="h-4 w-4" />,
      description: "View notes chronologically",
    },
  ];

  const recentNotes = [...notes].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const timelineNotes = [...notes].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const timelineGroups = timelineNotes.reduce(
    (groups, note) => {
      const date = new Date(note.created_at);
      const monthYear = `${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()}`;

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }

      groups[monthYear].push(note);
      return groups;
    },
    {} as Record<string, typeof notes>
  );

  const allTags = notes.reduce((tags, note) => {
    if (note.tags) {
      note.tags.forEach((tag) => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    }
    return tags;
  }, [] as string[]);

  const tagFilteredNotes =
    selectedTags.length > 0
      ? notes.filter(
          (note) => note.tags?.some((tag) => selectedTags.includes(tag))
        )
      : notes;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3 pb-2">
        {viewModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setSmartViewMode(mode.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-300",
              "border hover:shadow-sm relative group backdrop-blur-sm",
              smartViewMode === mode.id
                ? "bg-background/80 border-primary/30 text-primary shadow-sm"
                : "bg-background/40 border-border/30 hover:border-primary/20 hover:bg-background/60"
            )}
          >
            <div className="relative">
              <div
                className={cn(
                  "w-7 h-7 rounded-md flex items-center justify-center",
                  smartViewMode === mode.id ? "bg-primary/10" : "bg-muted/30"
                )}
              >
                {mode.icon}
              </div>
              {smartViewMode === mode.id && (
                <motion.div
                  className="absolute -right-1 -top-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                </motion.div>
              )}
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">{mode.label}</span>
              <span className="text-xs text-muted-foreground/70 hidden sm:inline-block">
                {mode.description}
              </span>
            </div>
            <ChevronRight
              className={cn(
                "h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-200",
                smartViewMode === mode.id
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={smartViewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {smartViewMode === "recent" && (
            <div className="space-y-6">
              <div className="bg-background/50 backdrop-blur-sm rounded-xl border border-border/30 p-5 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-medium mb-6 flex items-center gap-2 text-foreground/90">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-primary/80" />
                  </div>
                  <span>Recently Updated</span>
                </h3>
                <NoteList
                  notes={recentNotes}
                  viewMode={viewMode}
                  selectable={isSelectionMode}
                  onSelectionChange={onSelectionChange}
                />
              </div>
            </div>
          )}

          {smartViewMode === "tags" && (
            <div className="space-y-6">
              <div className="bg-background/50 backdrop-blur-sm rounded-xl border border-border/30 p-5 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-medium mb-6 flex items-center gap-2 text-foreground/90">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Tags className="h-4 w-4 text-primary/80" />
                  </div>
                  <span>Tag Cloud</span>
                </h3>
                <div className="flex flex-wrap gap-2 mb-8 p-4 bg-muted/20 rounded-lg border border-border/20">
                  {allTags.length > 0 ? (
                    allTags.map((tag) => (
                      <motion.button
                        key={tag}
                        onClick={() => handleTagSelect(tag)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                          selectedTags.includes(tag)
                            ? "bg-primary/90 text-white shadow-sm"
                            : "bg-background/70 text-foreground/70 hover:bg-primary/10 hover:text-primary border border-border/30"
                        )}
                      >
                        {tag}
                      </motion.button>
                    ))
                  ) : (
                    <div className="w-full text-center py-6 text-muted-foreground">
                      <p>No tags found in your notes</p>
                    </div>
                  )}
                </div>
                {selectedTags.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                        <Tags className="h-3.5 w-3.5 text-primary/70" />
                        Notes with selected tags
                      </h4>
                      <button
                        onClick={() => setSelectedTags([])}
                        className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                      >
                        Clear selection
                      </button>
                    </div>
                    <NoteList
                      notes={tagFilteredNotes}
                      viewMode={viewMode}
                      selectable={isSelectionMode}
                      onSelectionChange={onSelectionChange}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {smartViewMode === "ai" && (
            <div className="space-y-6">
              {clusters.map((cluster) => (
                <div
                  key={cluster.name}
                  className="bg-background/50 backdrop-blur-sm rounded-xl border border-border/30 p-5 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h3 className="text-lg font-medium mb-6 flex items-center gap-2 text-foreground/90">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {cluster.icon}
                    </div>
                    <div>
                      <span>{cluster.name}</span>
                      <div className="text-xs text-muted-foreground/70 mt-0.5">
                        AI-generated cluster
                      </div>
                    </div>
                  </h3>
                  {cluster.notes.length > 0 ? (
                    <NoteList
                      notes={cluster.notes}
                      viewMode={viewMode}
                      selectable={isSelectionMode}
                      onSelectionChange={onSelectionChange}
                    />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground bg-muted/10 rounded-lg border border-border/20">
                      <p>No notes found in this cluster</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {smartViewMode === "timeline" && (
            <div className="space-y-6">
              {Object.entries(timelineGroups).map(([monthYear, notes]) => (
                <div
                  key={monthYear}
                  className="bg-background/50 backdrop-blur-sm rounded-xl border border-border/30 p-5 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <h3 className="text-lg font-medium mb-6 flex items-center gap-2 text-foreground/90">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <CalendarDays className="h-4 w-4 text-primary/80" />
                    </div>
                    <span>{monthYear}</span>
                  </h3>
                  <NoteList
                    notes={notes}
                    viewMode={viewMode}
                    selectable={isSelectionMode}
                    onSelectionChange={onSelectionChange}
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

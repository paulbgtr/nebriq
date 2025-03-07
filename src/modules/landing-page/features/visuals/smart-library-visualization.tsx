import { useState, memo } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Tag,
  FolderIcon,
} from "lucide-react";

export const SmartLibraryVisualization = memo(() => {
  const [activeTab, setActiveTab] = useState("smart");

  const notes = [
    {
      id: "note1",
      title: "Project Kickoff Meeting",
      excerpt:
        "Discussion about timeline, resources, and initial requirements...",
      category: "Work",
      date: "2 days ago",
      tags: ["meeting", "project"],
    },
    {
      id: "note2",
      title: "Book: Thinking Fast and Slow",
      excerpt: "Key insights about System 1 and System 2 thinking processes...",
      category: "Reading",
      date: "1 week ago",
      tags: ["book", "psychology"],
    },
    {
      id: "note3",
      title: "Weekly Planning",
      excerpt: "Goals for this week include completing the research phase...",
      category: "Personal",
      date: "Yesterday",
      tags: ["planning", "goals"],
    },
    {
      id: "note4",
      title: "Research on AI Applications",
      excerpt:
        "Exploring potential use cases for machine learning in our product...",
      category: "Research",
      date: "3 days ago",
      tags: ["AI", "research"],
    },
    {
      id: "note5",
      title: "Product Design Ideas",
      excerpt: "Sketches and concepts for the new dashboard interface...",
      category: "Work",
      date: "5 days ago",
      tags: ["design", "product"],
    },
    {
      id: "note6",
      title: "Learning Resources: React Patterns",
      excerpt:
        "Advanced techniques for state management and component design...",
      category: "Learning",
      date: "2 weeks ago",
      tags: ["react", "programming"],
    },
  ];

  const categories = notes.reduce(
    (acc, note) => {
      if (!acc[note.category]) {
        acc[note.category] = [];
      }
      acc[note.category].push(note);
      return acc;
    },
    {} as Record<string, typeof notes>
  );

  return (
    <div className="w-full h-full flex flex-col p-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">Knowledge Hub</div>
          <div className="text-xs text-muted-foreground">
            {notes.length} notes
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md hover:bg-muted cursor-pointer">
            <Search className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="p-1.5 rounded-md hover:bg-muted cursor-pointer">
            <Filter className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="p-1.5 rounded-md hover:bg-muted cursor-pointer">
            <Plus className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-border mb-3">
        <div
          className={`px-3 py-1.5 text-xs font-medium cursor-pointer border-b-2 transition-colors ${
            activeTab === "smart"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("smart")}
        >
          Smart View
        </div>
        <div
          className={`px-3 py-1.5 text-xs font-medium cursor-pointer border-b-2 transition-colors ${
            activeTab === "categories"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "smart" && (
          <div className="grid grid-cols-2 gap-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-2 rounded-lg border border-border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="text-xs font-medium line-clamp-1">
                    {note.title}
                  </div>
                  <div className="p-0.5 rounded-md hover:bg-muted">
                    <MoreHorizontal className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground line-clamp-2 mb-1.5">
                  {note.excerpt}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        {note.tags[0]}
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {note.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "categories" && (
          <div className="space-y-3">
            {Object.entries(categories).map(([category, categoryNotes]) => (
              <div key={category} className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <FolderIcon className="w-3.5 h-3.5 text-primary" />
                  <span>{category}</span>
                  <span className="text-[10px] text-muted-foreground">
                    ({categoryNotes.length})
                  </span>
                </div>
                <div className="pl-5 space-y-1">
                  {categoryNotes.map((note) => (
                    <div
                      key={note.id}
                      className="flex items-center justify-between py-1 px-2 rounded hover:bg-muted/50 cursor-pointer"
                    >
                      <div className="text-xs truncate">{note.title}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {note.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

SmartLibraryVisualization.displayName = "SmartLibraryVisualization";

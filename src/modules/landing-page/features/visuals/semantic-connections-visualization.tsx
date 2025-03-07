import { Lightbulb } from "lucide-react";
import { useState, useRef, useEffect, memo } from "react";

export const SemanticConnectionsVisualization = memo(() => {
  const [showConnections, setShowConnections] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);

  const editorContent = `# Project Research Notes

In today's meeting, we discussed the implementation of a new feature that would allow users to automatically organize their notes based on semantic similarity. This approach would leverage natural language processing techniques to identify related concepts across different notes.

The key benefits of this feature include:
- Reduced manual organization time
- Discovery of non-obvious connections
- Improved knowledge retrieval`;

  const connectedNotes = [
    {
      id: "note1",
      title: "NLP Techniques Overview",
      excerpt:
        "Natural language processing (NLP) is a field of AI that gives computers the ability to understand text and spoken words...",
    },
    {
      id: "note2",
      title: "Meeting Notes: Feature Planning",
      excerpt:
        "Team agreed on implementing semantic search as the next priority. Timeline estimated at 3 weeks...",
    },
    {
      id: "note3",
      title: "Knowledge Management Systems",
      excerpt:
        "Modern knowledge management systems leverage AI to reduce information overload and improve retrieval...",
    },
  ];

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setShowConnections((prev) => !prev);

      if (!showConnections) {
        setTimeout(() => setShowConnections(true), 800);
      }
    }, 4000);

    return () => {
      clearInterval(pulseInterval);
    };
  }, [showConnections]);

  const renderHighlightedContent = (text: string) => {
    const headerReplaced = text.replace(
      /^(#{1,6})\s(.+)$/gm,
      '<span class="text-primary font-bold">$1 $2</span>'
    );

    const bulletReplaced = headerReplaced.replace(
      /^(\s*)-\s(.+)$/gm,
      '$1<span class="text-primary">-</span> $2'
    );

    return bulletReplaced;
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          Project Research Notes.md
        </div>
        <div className="w-4" />
      </div>

      <div
        ref={editorRef}
        className="flex-1 p-4 font-mono text-sm overflow-y-auto relative"
      >
        <div
          dangerouslySetInnerHTML={{
            __html: renderHighlightedContent(editorContent),
          }}
        />

        <div
          className={`absolute bottom-4 right-4 transition-all duration-500 ${
            showConnections ? "opacity-100" : "opacity-50"
          }`}
        >
          <div
            className={`p-2 rounded-full ${
              showConnections
                ? "bg-primary/20 text-primary animate-pulse"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Lightbulb className="w-5 h-5" />
          </div>
        </div>

        <div
          className={`absolute bottom-14 right-4 w-64 bg-card border border-border rounded-lg shadow-lg transition-all duration-300 ${
            showConnections
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <div className="p-2 border-b border-border bg-muted/50">
            <h4 className="text-xs font-medium">Connected Notes</h4>
          </div>
          <div className="p-2 max-h-[200px] overflow-y-auto">
            {connectedNotes.map((note) => (
              <div key={note.id} className="mb-3 last:mb-0">
                <h5 className="text-xs font-medium text-primary">
                  {note.title}
                </h5>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {note.excerpt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

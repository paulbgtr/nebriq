import { useState, useCallback, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { semanticSearch } from "@/app/actions/search/semantic-search";
import { useNotes } from "@/shared/hooks/data/use-notes";
import { z } from "zod";
import { noteSchema } from "@/shared/lib/schemas/note";
import { useNoteTabsStore } from "@/store/note-tabs";
import { useUser } from "@/shared/hooks/data/use-user";

type DiscoveredNote = z.infer<typeof noteSchema> & {
  matchScore: number;
  matchedText?: string;
};

export const useNoteDiscovery = (
  editor: Editor | null,
  currentNoteId: string
) => {
  const [isSearching, setIsSearching] = useState(false);
  const [discoveredNotes, setDiscoveredNotes] = useState<DiscoveredNote[]>([]);
  const [highlightedRanges, setHighlightedRanges] = useState<
    { from: number; to: number; noteId?: string; noteTitle?: string }[]
  >([]);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const { getNotesQuery } = useNotes();
  const { setOpenNotes, openNotes } = useNoteTabsStore();
  const { user } = useUser();

  const clearHighlights = useCallback(() => {
    if (!editor) return;

    editor.commands.unsetMark("highlight");
    setHighlightedRanges([]);
  }, [editor]);

  useEffect(() => {
    if (editor) {
      editor.commands.unsetMark("highlight");
      setHighlightedRanges([]);
    }
    setIsDiscoveryOpen(false);
    setDiscoveredNotes([]);
  }, [currentNoteId, editor]);

  useEffect(() => {
    if (!editor) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target.tagName === "MARK") {
        const noteId = target.getAttribute("data-note-id");

        if (noteId) {
          const note = discoveredNotes.find((n) => n.id === noteId);

          if (note) {
            const isNoteOpen = openNotes.some(
              (openNote) => openNote.id === noteId
            );

            if (!isNoteOpen) {
              setOpenNotes([
                ...openNotes,
                {
                  id: noteId,
                  title: note.title || "Untitled",
                  content: note.content || "",
                },
              ]);
            }
          }
        }
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener("click", handleClick);

    return () => {
      editorElement.removeEventListener("click", handleClick);
    };
  }, [editor, discoveredNotes, openNotes, setOpenNotes]);

  const highlightMatches = useCallback(
    (content: string, notes: DiscoveredNote[]) => {
      if (!editor) return;
      const currentText = editor.state.doc.textContent.toLowerCase();
      const ranges: {
        from: number;
        to: number;
        noteId?: string;
        noteTitle?: string;
      }[] = [];

      const significantPhrases: {
        text: string;
        noteId: string;
        noteTitle: string;
      }[] = [];

      notes.forEach((note) => {
        if (!note.content) return;

        const noteText = note.content.toLowerCase().replace(/<[^>]*>/g, "");

        const sentences = noteText
          .split(/[.!?]+/)
          .filter((s) => s.trim().length > 10);

        const words = noteText.split(/\s+/).filter((word) => word.length > 3);

        words.forEach((word) => {
          if (
            word.length > 5 &&
            !significantPhrases.some((p) => p.text === word)
          ) {
            significantPhrases.push({
              text: word,
              noteId: note.id,
              noteTitle: note.title || "Untitled",
            });
          }
        });

        for (let i = 0; i < words.length - 1; i++) {
          const phrase = `${words[i]} ${words[i + 1]}`;
          if (
            phrase.length > 8 &&
            !significantPhrases.some((p) => p.text === phrase)
          ) {
            significantPhrases.push({
              text: phrase,
              noteId: note.id,
              noteTitle: note.title || "Untitled",
            });
          }
        }

        sentences.forEach((sentence) => {
          const trimmed = sentence.trim();
          if (
            trimmed.length > 10 &&
            trimmed.length < 60 &&
            !significantPhrases.some((p) => p.text === trimmed)
          ) {
            significantPhrases.push({
              text: trimmed,
              noteId: note.id,
              noteTitle: note.title || "Untitled",
            });
          }
        });
      });

      significantPhrases.forEach((phrase) => {
        let startIndex = 0;
        let index;

        while ((index = currentText.indexOf(phrase.text, startIndex)) !== -1) {
          ranges.push({
            from: index,
            to: index + phrase.text.length,
            noteId: phrase.noteId,
            noteTitle: phrase.noteTitle,
          });
          startIndex = index + 1;
        }
      });

      const mergedRanges = mergeRanges(ranges);
      setHighlightedRanges(mergedRanges);

      mergedRanges.forEach((range, index) => {
        setTimeout(() => {
          if (!editor.isDestroyed) {
            editor.commands.setTextSelection({
              from: range.from,
              to: range.to,
            });

            editor.commands.setMark("highlight", {
              color: "transparent",
              "data-note-id": range.noteId,
              "data-note-title": range.noteTitle,
              class: `animate-highlight highlight-${index % 3}`,
              style: "border: 1px dashed rgba(100, 116, 139, 0.3);",
            });
          }
        }, index * 80);
      });

      const editorElement = editor.view.dom;
      const scanLine = document.createElement("div");
      scanLine.className =
        "absolute left-0 w-full h-0.5 bg-muted-foreground/20 z-10 pointer-events-none";
      scanLine.style.transition = "top 1.5s cubic-bezier(0.4, 0, 0.2, 1)";
      scanLine.style.top = "0";
      editorElement.style.position = "relative";
      editorElement.appendChild(scanLine);

      setTimeout(() => {
        scanLine.style.top = "100%";
      }, 10);

      setTimeout(() => {
        if (editorElement.contains(scanLine)) {
          editorElement.removeChild(scanLine);
        }
      }, 1600);

      setTimeout(
        () => {
          if (!editor.isDestroyed) {
            editor.commands.setTextSelection(editor.state.selection.from);
          }
        },
        mergedRanges.length * 80 + 100
      );
    },
    [editor]
  );

  const findRelatedNotes = useCallback(async () => {
    if (!editor || !getNotesQuery.data || isSearching || !currentNoteId) return;

    setIsSearching(true);
    clearHighlights();

    try {
      const content = editor.getHTML();

      const otherNotes = getNotesQuery.data.filter(
        (note) => note.id !== currentNoteId
      );

      if (!otherNotes.length) {
        setDiscoveredNotes([]);
        setIsSearching(false);
        return;
      }

      if (!user?.id) {
        setDiscoveredNotes([]);
        setIsSearching(false);
        return;
      }

      const results = await semanticSearch(content, otherNotes, user.id);

      if (!results.length) {
        setDiscoveredNotes([]);
        setIsSearching(false);
        return;
      }

      const processedResults = results.map((note, index) => {
        const matchScore = 1 - index / Math.max(results.length, 1);

        return {
          ...note,
          matchScore,
        };
      });

      setDiscoveredNotes(processedResults);
      setIsDiscoveryOpen(true);

      highlightMatches(content, processedResults);
    } catch (error) {
      console.error("Error finding related notes:", error);
    } finally {
      setIsSearching(false);
    }
  }, [
    editor,
    getNotesQuery.data,
    currentNoteId,
    isSearching,
    clearHighlights,
    highlightMatches,
    user?.id,
  ]);

  const mergeRanges = (
    ranges: { from: number; to: number; noteId?: string; noteTitle?: string }[]
  ) => {
    if (!ranges.length) return [];

    const sortedRanges = [...ranges].sort((a, b) => a.from - b.from);

    const mergedRanges: {
      from: number;
      to: number;
      noteId?: string;
      noteTitle?: string;
    }[] = [];
    let currentRange = sortedRanges[0];

    for (let i = 1; i < sortedRanges.length; i++) {
      const range = sortedRanges[i];

      if (range.from <= currentRange.to) {
        currentRange.to = Math.max(currentRange.to, range.to);
      } else {
        mergedRanges.push(currentRange);
        currentRange = range;
      }
    }

    mergedRanges.push(currentRange);
    return mergedRanges;
  };

  const toggleDiscovery = useCallback(() => {
    if (isDiscoveryOpen) {
      clearHighlights();
    } else {
      findRelatedNotes();
    }
    setIsDiscoveryOpen(!isDiscoveryOpen);
  }, [isDiscoveryOpen, findRelatedNotes, clearHighlights]);

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === "l") {
        event.preventDefault();
        toggleDiscovery();
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener("keydown", handleKeyDown);

    return () => {
      editorElement.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, toggleDiscovery]);

  return {
    isSearching,
    discoveredNotes,
    highlightedRanges,
    isDiscoveryOpen,
    findRelatedNotes,
    clearHighlights,
    toggleDiscovery,
  };
};

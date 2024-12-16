import "katex/dist/katex.min.css";

import { useNoteConnections } from "./use-note-connections";
import { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import createSuggestion from "@/shared/lib/tippy/suggestion";
import { useUser } from "./use-user";
import { useNotes } from "./use-notes";
import { useNoteTabsStore } from "@/store/note-tabs";

import Mathematics, {
  defaultShouldRender,
} from "@tiptap-pro/extension-mathematics";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";

export const useCustomEditor = (initialNoteId: string | null) => {
  const { getNotesQuery } = useNotes();
  const { openNotes, setOpenNotes } = useNoteTabsStore();

  const [id, setId] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  useEffect(() => {
    if (id && !openNotes.find((note) => note.id === id)) {
      setOpenNotes([
        ...openNotes,
        {
          id,
          title,
          content,
        },
      ]);
    }
  }, [id, setOpenNotes]);

  useEffect(() => {
    if (initialNoteId) {
      const note = getNotesQuery.data?.find(
        (note) => note.id === initialNoteId
      );

      if (note) {
        setContent(note.content || "");
        setTitle(note.title || "");
        setId(note.id);
      }
    }
  }, [initialNoteId, getNotesQuery.data]);

  const { user } = useUser();
  const { createNoteMutation, updateNoteMutation } = useNotes();
  useNoteConnections({ noteId: id, content });

  const createNote = async () => {
    if (!user || id || initialNoteId) return;

    setIsCreatingNote(true);
    createNoteMutation.mutate(
      {
        title,
        content,
        created_at: new Date(),
        user_id: user.id,
      },
      {
        onSuccess: (data) => {
          setId(data?.[0]?.id);
          setIsCreatingNote(false);
        },
        onError: () => {
          setIsCreatingNote(false);
        },
      }
    );
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);

    // Create note if this is the first title input
    if (!id && !isCreatingNote) {
      createNote();
    }
  };

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit,
        Placeholder.configure(),
        Mention.configure({
          HTMLAttributes: {
            class: "mention cursor-pointer",
          },
          suggestion: createSuggestion(id),
        }),
        Mathematics.configure({
          shouldRender: defaultShouldRender,
        }),
      ],
      editorProps: {
        attributes: {
          class: "prose prose-slate focus:outline-none",
        },
        handleClick: (view, pos, event) => {
          console.log(event);

          const node = view.state.doc.nodeAt(pos);
          if (node?.type.name === "mention") {
            const mentionTitle = node.attrs.id;
            const note = getNotesQuery.data?.find(
              (note) => note.title?.toLowerCase() === mentionTitle.toLowerCase()
            );
            if (note) {
              window.location.href = `/write?id=${note.id}`;
            }
            return true;
          }
          return false;
        },
      },
      content,
      onUpdate: ({ editor }) => {
        const newContent = editor.getHTML();
        setContent(newContent);

        if (!id && !isCreatingNote) {
          createNote();
        }

        const timeoutId = setTimeout(() => {
          if (!id) return;
          updateNoteMutation.mutate({
            id,
            title,
            content: newContent,
            created_at: new Date(),
          });
        }, 500);

        return () => clearTimeout(timeoutId);
      },
    },
    [id]
  );

  const isPending = createNoteMutation.isPending;

  return {
    id,
    setId,
    editor,
    title,
    setTitle: handleTitleChange,
    content,
    setContent,
    isCreatingNote,
    setIsCreatingNote,
    isPending,
  };
};

import "katex/dist/katex.min.css";

import { useNoteConnections } from "./use-note-connections";
import { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import createSuggestion from "@/shared/lib/tippy/suggestion";
import { useUser } from "./use-user";
import { useNotes } from "./use-notes";
import { useNoteTabs } from "./use-note-tabs";

import Mathematics, {
  defaultShouldRender,
} from "@tiptap-pro/extension-mathematics";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";

export const useCustomEditor = (initialNoteId: string | null) => {
  const { getNotesQuery } = useNotes();
  const { getTabsQuery, createNoteTabMutation } = useNoteTabs();

  const [id, setId] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  useEffect(() => {
    if (id && !getTabsQuery.data?.find((tab) => tab.id === id)) {
      createNoteTabMutation.mutate({
        note_id: id,
      });
    }
  }, [id, getTabsQuery.data]);

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
  }, [initialNoteId]);

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
            class: "mention",
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

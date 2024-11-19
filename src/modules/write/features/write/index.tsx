"use client";

import { useState } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useNotes } from "@/hooks/use-notes";
import { Spinner } from "@/shared/components/spinner";
import { Editor } from "./components/editor";
import { useUser } from "@/hooks/use-user";

export default function Write() {
  const [id, setId] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  const { user } = useUser();
  const { createNoteMutation, updateNoteMutation } = useNotes();

  const createNote = async () => {
    if (!user || id) return;

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

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Placeholder.configure()],
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
  });

  // Handle title changes
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);

    // Create note if this is the first title input
    if (!id && !isCreatingNote) {
      createNote();
    }
  };

  if (createNoteMutation.isPending && !editor) {
    return <Spinner />;
  }

  return (
    <Editor
      id={id}
      editor={editor}
      title={title}
      setTitle={handleTitleChange}
      content={content}
    />
  );
}

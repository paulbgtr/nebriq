"use client";

import { useState, useEffect } from "react";
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

  const { user } = useUser();

  const { createNoteMutation, updateNoteMutation } = useNotes();

  useEffect(() => {
    if (!user) return;

    if (!id) {
      createNoteMutation.mutate(
        {
          title: "",
          content: "",
          created_at: new Date(),
          user_id: user!.id,
        },
        {
          onSuccess: (data) => {
            setId(data?.[0]?.id);
          },
        }
      );
    }
  }, [user, id]);

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

      // Debounce the update to avoid too many API calls
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

  if (createNoteMutation.isPending) {
    return <Spinner />;
  }

  return (
    <Editor
      id={id}
      editor={editor}
      title={title}
      setTitle={setTitle}
      content={content}
    />
  );
}

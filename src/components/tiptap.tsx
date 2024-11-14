"use client";

import { useState, useEffect } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useNotes } from "@/hooks/use-notes";
import { Spinner } from "@/components/spinner";

const Tiptap = () => {
  const [id, setId] = useState("");
  const [content, setContent] = useState("");

  const { createNoteMutation, updateNoteMutation } = useNotes();

  useEffect(() => {
    createNoteMutation.mutate(
      {
        title: "",
        content: "",
        created_at: new Date(),
      },
      {
        onSuccess: (data) => {
          setId(data?.[0]?.id);
        },
      }
    );
  }, []);

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

      updateNoteMutation.mutate({
        id,
        title: "",
        content: newContent,
        created_at: new Date(),
      });
    },
  });

  if (createNoteMutation.isPending) {
    return <Spinner />;
  }

  return (
    <div
      className="h-full cursor-text"
      onClick={() => editor?.commands.focus()}
    >
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;

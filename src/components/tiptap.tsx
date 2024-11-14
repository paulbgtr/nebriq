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
  const [title, setTitle] = useState("");

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
        title,
        content: newContent,
        created_at: new Date(),
      });
    },
  });

  if (createNoteMutation.isPending) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          updateNoteMutation.mutate({
            id,
            title: e.target.value,
            content,
            created_at: new Date(),
          });
        }}
        placeholder="Untitled"
        className="text-2xl font-bold bg-transparent border-none outline-none placeholder:text-gray-400 focus:ring-0"
      />
      <div
        className="h-full cursor-text"
        onClick={() => editor?.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Tiptap;

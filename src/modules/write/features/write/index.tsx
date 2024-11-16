"use client";

import { useState, useEffect } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useNotes } from "@/hooks/use-notes";
import { Spinner } from "@/shared/components/spinner";
import { Editor } from "./components/editor";
import { createClient } from "@/shared/lib/supabase/client";

export default function Write() {
  const [id, setId] = useState("");
  const [userId, setUserId] = useState<string | undefined>();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const { createNoteMutation, updateNoteMutation } = useNotes();

  useEffect(() => {
    const getUserId = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      console.log(data);
      setUserId(data?.user?.id);
    };

    getUserId();

    if (!userId) return;

    if (!id) {
      createNoteMutation.mutate(
        {
          title: "",
          user_id: userId,
          content: "",
          created_at: new Date(),
        },
        {
          onSuccess: (data) => {
            setId(data?.[0]?.id);
          },
        }
      );
    }
  }, [userId]);

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
        if (!id || !userId) return;
        updateNoteMutation.mutate({
          id,
          title,
          user_id: userId,
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

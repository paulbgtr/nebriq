"use client";

import { Editor } from "./components/editor";
import { useCustomEditor } from "@/hooks/use-editor";

export default function Write() {
  const { id, title, content, setTitle, editor } = useCustomEditor();

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

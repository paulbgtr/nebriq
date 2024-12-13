"use client";

import { useCustomEditor } from "@/hooks/use-editor";
import { useSearchParams } from "next/navigation";

import { Editor } from "./components/editor";

export default function Write() {
  const searchParams = useSearchParams();
  const { id, title, content, setTitle, editor } = useCustomEditor(
    searchParams.get("id")
  );

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

"use client";

import { Spinner } from "@/shared/components/spinner";
import { Editor } from "./components/editor";
import { useCustomEditor } from "@/hooks/use-editor";

export default function Write() {
  const { id, title, content, setTitle, editor, isPending } = useCustomEditor();

  if (isPending || !editor) {
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

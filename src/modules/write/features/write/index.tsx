"use client";

import { useSearchParams } from "next/navigation";

import { Editor } from "./components/editor";

export default function Write() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <Editor initialNoteId={id} />
      </div>
    </div>
  );
}

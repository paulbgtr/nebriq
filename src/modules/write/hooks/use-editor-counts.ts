import { useState, useCallback, useEffect } from "react";
import { Editor } from "@tiptap/react";

type Props = {
  editor: Editor | null;
  content: string;
};

export const useEditorCounts = ({ editor, content }: Props) => {
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  const updateCounts = useCallback(() => {
    if (!editor) return;
    const text = editor.state.doc.textContent;
    setCharacterCount(text.length);
    setWordCount(text.split(/\s+/).filter(Boolean).length);
  }, [editor]);

  useEffect(() => {
    if (editor && content) {
      updateCounts();
    }
  }, [editor, content, updateCounts]);

  return { wordCount, characterCount };
};

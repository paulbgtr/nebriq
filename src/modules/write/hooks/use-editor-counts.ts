import { useState, useCallback, useEffect } from "react";
import { Editor } from "@tiptap/react";

type Props = {
  editor: Editor | null;
  content: string;
};

export type EditorStats = {
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTime: number; // in minutes
};

export const useEditorCounts = ({ editor, content }: Props): EditorStats => {
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  const updateCounts = useCallback(() => {
    if (!editor) return;

    const text = editor.state.doc.textContent;

    const chars = text.length;
    setCharacterCount(chars);

    const words = text.split(/\s+/).filter(Boolean).length;
    setWordCount(words);

    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    setSentenceCount(sentences);

    const paragraphs = editor.state.doc.content.childCount;
    setParagraphCount(paragraphs);

    const avgReadingSpeed = 200;
    const minutes = Math.max(
      1,
      Math.round((words / avgReadingSpeed) * 10) / 10
    );
    setReadingTime(minutes);
  }, [editor]);

  useEffect(() => {
    if (editor) {
      updateCounts();

      const handleUpdate = () => {
        updateCounts();
      };

      editor.on("update", handleUpdate);

      return () => {
        editor.off("update", handleUpdate);
      };
    }
  }, [editor, updateCounts]);

  useEffect(() => {
    if (editor && content) {
      updateCounts();
    }
  }, [editor, content, updateCounts]);

  return {
    wordCount,
    characterCount,
    sentenceCount,
    paragraphCount,
    readingTime,
  };
};

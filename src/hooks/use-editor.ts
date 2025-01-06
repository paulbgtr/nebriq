import "katex/dist/katex.min.css";

import { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import createSuggestion from "@/shared/lib/tippy/suggestion";
import { useUser } from "./use-user";
import { useNotes } from "./use-notes";
import { useNoteTabsStore } from "@/store/note-tabs";
import { all, createLowlight } from "lowlight";

import Image from "@tiptap/extension-image";
import Mathematics, {
  defaultShouldRender,
} from "@tiptap-pro/extension-mathematics";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";

export const useCustomEditor = (initialNoteId: string | null) => {
  const lowlight = createLowlight(all);
  const { getNotesQuery } = useNotes();
  const { openNotes, setOpenNotes } = useNoteTabsStore();

  const [id, setId] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isCreatingNote, setIsCreatingNote] = useState(false);

  useEffect(() => {
    if (id && !openNotes.find((note) => note.id === id)) {
      setOpenNotes([
        ...openNotes,
        {
          id,
          title,
          content,
        },
      ]);
    }
  }, [id, setOpenNotes]);

  const { user } = useUser();
  const { createNoteMutation, updateNoteMutation } = useNotes();
  // useNoteConnections({ noteId: id, content });

  const createNote = async () => {
    if (!user || id || initialNoteId) return;

    setIsCreatingNote(true);
    createNoteMutation.mutate(
      {
        title: title || "Untitled",
        content: content || "",
        user_id: user.id,
      },
      {
        onSuccess: (data) => {
          setId(data.id);
          setIsCreatingNote(false);
        },
        onError: () => {
          setIsCreatingNote(false);
        },
      }
    );
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);

    // Create note if this is the first title input
    if (!id && !isCreatingNote) {
      createNote();
    }
  };

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit,
        Underline,
        Image,
        CodeBlockLowlight.configure({
          lowlight,
        }),
        Placeholder.configure(),
        Mention.configure({
          HTMLAttributes: {
            class: "mention cursor-pointer",
          },
          suggestion: createSuggestion(id),
        }),
        Mathematics.configure({
          shouldRender: defaultShouldRender,
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Link.configure({
          openOnClick: true,
          autolink: true,
          defaultProtocol: "https",
          protocols: ["http", "https"],
          isAllowedUri: (url, ctx) => {
            try {
              const fullUrl = url.match(/^https?:\/\//)
                ? url
                : `${ctx.defaultProtocol}://${url}`;
              const parsedUrl = new URL(fullUrl);

              if (!ctx.defaultValidate(parsedUrl.href)) {
                return false;
              }

              const disallowedProtocols = ["ftp", "file", "mailto"];
              const protocol = parsedUrl.protocol.replace(":", "");

              if (disallowedProtocols.includes(protocol)) {
                return false;
              }

              const allowedProtocols = ctx.protocols.map((p) =>
                typeof p === "string" ? p : p.scheme
              );

              if (!allowedProtocols.includes(protocol)) {
                return false;
              }

              const disallowedDomains = [
                "example-phishing.com",
                "malicious-site.net",
              ];
              const domain = parsedUrl.hostname;

              if (disallowedDomains.includes(domain)) {
                return false;
              }

              return true;
            } catch {
              return false;
            }
          },
          shouldAutoLink: (url) => {
            try {
              const parsedUrl = url.includes(":")
                ? new URL(url)
                : new URL(`https://${url}`);

              const disallowedDomains = [
                "example-no-autolink.com",
                "another-no-autolink.com",
              ];
              const domain = parsedUrl.hostname;

              return !disallowedDomains.includes(domain);
            } catch {
              return false;
            }
          },
        }),
      ],
      editorProps: {
        attributes: {
          class: "prose prose-slate focus:outline-none",
        },
        handleClick: (view, pos, event) => {
          console.log(event);

          const node = view.state.doc.nodeAt(pos);
          if (node?.type.name === "mention") {
            const mentionTitle = node.attrs.id;
            const note = getNotesQuery.data?.find(
              (note) => note.title?.toLowerCase() === mentionTitle.toLowerCase()
            );
            if (note) {
              window.location.href = `/write?id=${note.id}`;
            }
            return true;
          }
          return false;
        },
      },
      autofocus: true,
      enableInputRules: true,
      enablePasteRules: true,
      content,
      onUpdate: ({ editor }) => {
        const newContent = editor.getHTML();
        setContent(newContent);

        if (!id && !isCreatingNote) {
          createNote();
        }

        const timeoutId = setTimeout(() => {
          if (!id) return;
          updateNoteMutation.mutate({
            id,
            title,
            content: newContent,
          });
        }, 500);

        return () => clearTimeout(timeoutId);
      },
    },
    [id]
  );

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  useEffect(() => {
    if (initialNoteId) {
      const note = getNotesQuery.data?.find(
        (note) => note.id === initialNoteId
      );

      if (note) {
        setContent(note.content || "");
        setTitle(note.title || "");
        setId(note.id);
        editor?.commands.setContent(note.content || "");
      }
    }
  }, [initialNoteId, getNotesQuery.data, editor]);

  const { isPending } = createNoteMutation;

  return {
    id,
    setId,
    editor,
    title,
    setTitle: handleTitleChange,
    content,
    setContent,
    isCreatingNote,
    setIsCreatingNote,
    isPending,
  };
};

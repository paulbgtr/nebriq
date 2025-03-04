import "katex/dist/katex.min.css";

import { useCallback, useEffect, useState, useRef } from "react";
import { useEditor } from "@tiptap/react";
import createSuggestion from "@/shared/lib/tippy/suggestion";
import { useUser } from "@/shared/hooks/use-user";
import { useNotes } from "@/shared/hooks/use-notes";
import { useNoteTabsStore } from "@/store/note-tabs";
import { all, createLowlight } from "lowlight";
import { useSyncNoteConnections } from "./use-sync-note-connections";
import { useDebouncedCallback } from "use-debounce";
import { useToast } from "@/shared/hooks/use-toast";
import { useNoteConnections } from "@/shared/hooks/use-note-connections";
import { extractNoteConnectionsFromContent } from "@/shared/lib/utils";

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
import { FileElement } from "@/shared/lib/tippy/nodes/file-element";

export const useCustomEditor = (initialNoteId: string | null) => {
  const lowlight = createLowlight(all);
  const { getNotesQuery } = useNotes();
  const { openNotes, setOpenNotes } = useNoteTabsStore();
  const { toast } = useToast();
  const { user } = useUser();
  const { createNoteMutation, updateNoteMutation } = useNotes();
  const initialLoadRef = useRef(false);

  const [id, setId] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState("");

  useSyncNoteConnections(id, content);

  const { noteConnectionsQuery } = useNoteConnections(id);

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
          toast({
            title: "Error creating note",
            description: "Please try again",
            variant: "destructive",
          });
        },
      }
    );
  };

  const updateNote = useDebouncedCallback(
    useCallback(
      (newTitle?: string, newContent?: string) => {
        if (!id) return;

        setIsSaving(true);
        updateNoteMutation.mutate(
          {
            id,
            title: newTitle ?? title,
            content: newContent ?? content,
          },
          {
            onSuccess: (updatedNote) => {
              setIsSaving(false);
              if (newContent) {
                setLastSavedContent(newContent);
              }
              const updatedNotes = openNotes.map((note) =>
                note.id === id
                  ? { ...note, title: updatedNote.title || "Untitled" }
                  : note
              );
              setOpenNotes(updatedNotes);
            },
            onError: () => {
              setIsSaving(false);
              toast({
                title: "Error saving changes",
                description: "Please try again",
                variant: "destructive",
              });
            },
          }
        );
      },
      [id, title, content, updateNoteMutation, toast, openNotes, setOpenNotes]
    ),
    1000
  );

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);

    if (!id && !isCreatingNote) {
      createNote();
    }

    const updatedNotes = openNotes.map((note) =>
      note.id === id ? { ...note, title: newTitle } : note
    );
    setOpenNotes(updatedNotes);

    updateNote(newTitle);
  };

  const handleEditorUpdate = useDebouncedCallback((newContent: string) => {
    if (!id) return;

    setIsSaving(true);

    updateNoteMutation.mutate(
      { id, title, content: newContent },
      {
        onSuccess: () => {
          setLastSavedContent(newContent);
          setIsSaving(false);
        },
        onError: () => {
          toast({
            title: "Error saving changes",
            description: "Please try again",
            variant: "destructive",
          });
          setIsSaving(false);
        },
      }
    );
  }, 800);

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        FileElement,
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
      autofocus: false,
      enableInputRules: true,
      enablePasteRules: true,
      content,
      onUpdate: ({ editor, transaction }) => {
        if (transaction.getMeta("avoidSave")) return;

        const newContent = editor.getHTML();
        const cursorPos = editor.state.selection.anchor;

        setContent(newContent);
        handleEditorUpdate(newContent);

        if (!id && !isCreatingNote) {
          createNote();
        }

        requestAnimationFrame(() => {
          editor.commands.focus(cursorPos);
        });
      },
    },
    [id, handleEditorUpdate]
  );

  useEffect(() => {
    if (!editor || !id || !getNotesQuery.data || initialLoadRef.current) return;

    const loadedNote = getNotesQuery.data.find((note) => note.id === id);
    if (loadedNote?.content) {
      editor.commands.setContent(loadedNote.content, false, {
        preserveWhitespace: "full",
      });
      setContent(loadedNote.content);
      setLastSavedContent(loadedNote.content);
      initialLoadRef.current = true;
    }
  }, [id, editor, getNotesQuery.data]);

  useEffect(() => {
    if (!editor || !id || !noteConnectionsQuery.data || !lastSavedContent)
      return;

    if (noteConnectionsQuery.isSuccess && lastSavedContent) {
      const currentMentions = extractNoteConnectionsFromContent(content);
      const savedMentions = extractNoteConnectionsFromContent(lastSavedContent);

      if (currentMentions?.length !== savedMentions?.length) {
        const cursorPos = editor.state.selection.anchor;

        editor.commands.setContent(lastSavedContent, false, {
          preserveWhitespace: "full",
        });

        editor.commands.setTextSelection(cursorPos);
      }
    }
  }, [
    noteConnectionsQuery.data,
    noteConnectionsQuery.isSuccess,
    editor,
    id,
    lastSavedContent,
    content,
  ]);

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

  useEffect(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    editor.commands.setContent(content, false, {
      preserveWhitespace: "full",
    });
    editor.commands.setTextSelection({ from, to });
  }, [editor, content]);

  useEffect(() => {
    if (initialNoteId) {
      const note = getNotesQuery.data?.find(
        (note) => note.id === initialNoteId
      );

      if (note) {
        setTitle(note.title || "");
        setId(note.id);
        setContent(note.content || "");
        setLastSavedContent(note.content || "");
      }
    }
  }, [initialNoteId, getNotesQuery.data]);

  const { isPending } = createNoteMutation;

  return {
    id,
    setId,
    editor,
    title,
    handleTitleChange,
    content,
    setContent,
    isCreatingNote,
    setIsCreatingNote,
    isPending,
    updateNote,
    isSaving,
  };
};

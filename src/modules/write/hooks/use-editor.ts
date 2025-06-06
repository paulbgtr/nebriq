import "katex/dist/katex.min.css";

import { useCallback, useEffect, useState, useRef } from "react";
import { useEditor } from "@tiptap/react";
import createSuggestion from "@/shared/lib/tippy/suggestion";
import { useUser } from "@/shared/hooks/data/use-user";
import { useNotes } from "@/shared/hooks/data/use-notes";
import { useNoteTabsStore } from "@/store/note-tabs";
import { all, createLowlight } from "lowlight";
import { useSyncNoteConnections } from "./use-sync-note-connections";
import { useDebouncedCallback } from "use-debounce";
import { useToast } from "@/shared/hooks/use-toast";
import { useNoteConnections } from "@/shared/hooks/editor/use-note-connections";
import { extractNoteConnectionsFromContent } from "@/shared/lib/utils";
import { useSyncNoteToPinecone } from "./use-sync-note-to-pinecone";

import Image from "@tiptap/extension-image";
// import Mathematics, {
//   defaultShouldRender,
// } from "@tiptap-pro/extension-mathematics";
// commenting to reduce the amount of proprietary software in the repo
// todo: use https://github.com/aarkue/tiptap-math-extension
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { FileElement } from "@/shared/lib/tippy/nodes/file-element";

export const useCustomEditor = (initialNoteId: string | null) => {
  const lowlight = createLowlight(all);
  const { getNotesQuery } = useNotes();
  const { openNotes, setOpenNotes } = useNoteTabsStore();
  const { toast } = useToast();
  const { user } = useUser();
  const { createNoteMutation, updateNoteMutation } = useNotes();
  const initialLoadRef = useRef(false);
  const { syncNoteToPinecone, isSyncing } = useSyncNoteToPinecone(5000); // 5 second debounce

  const [id, setId] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState("");
  const isUpdatingRef = useRef(false);
  const lastUserEditTimeRef = useRef(Date.now());

  useSyncNoteConnections(id, content);

  const { noteConnectionsQuery } = useNoteConnections(id);

  const createNote = async () => {
    if (!user || id || initialNoteId) return;

    setIsCreatingNote(true);
    const currentContent = editor ? editor.getHTML() : content;

    createNoteMutation.mutate(
      {
        title: title || "Untitled",
        content: currentContent || "",
        user_id: user.id,
      },
      {
        onSuccess: (data) => {
          setId(data.id);
          setIsCreatingNote(false);
          setLastSavedContent(currentContent || "");
          syncNoteToPinecone(data.id, title, currentContent || "");
        },
        onError: () => {
          setIsCreatingNote(false);
          toast({
            title: "Error creating note",
            description: "Please try again",
            variant: "destructive",
          });
        },
      },
    );
  };

  const updateNote = useDebouncedCallback(
    useCallback(
      (newTitle?: string, newContent?: string) => {
        if (!id || isUpdatingRef.current) return;

        isUpdatingRef.current = true;
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
              isUpdatingRef.current = false;
              if (newContent) {
                setLastSavedContent(newContent);
              }
              const updatedNotes = openNotes.map((note) =>
                note.id === id
                  ? { ...note, title: updatedNote.title || "Untitled" }
                  : note,
              );
              setOpenNotes(updatedNotes);

              syncNoteToPinecone(
                id,
                updatedNote.title || "",
                updatedNote.content || "",
              );
            },
            onError: () => {
              setIsSaving(false);
              isUpdatingRef.current = false;
              toast({
                title: "Error saving changes",
                description: "Please try again",
                variant: "destructive",
              });
            },
          },
        );
      },
      [
        id,
        title,
        content,
        updateNoteMutation,
        toast,
        openNotes,
        setOpenNotes,
        syncNoteToPinecone,
      ],
    ),
    1000,
  );

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);

    if (!id && !isCreatingNote) {
      createNote();
    }

    const updatedNotes = openNotes.map((note) =>
      note.id === id ? { ...note, title: newTitle } : note,
    );
    setOpenNotes(updatedNotes);

    updateNote(newTitle);
  };

  const handleEditorUpdate = useDebouncedCallback((newContent: string) => {
    if (!id || isUpdatingRef.current) return;

    isUpdatingRef.current = true;
    setIsSaving(true);

    updateNoteMutation.mutate(
      { id, title, content: newContent },
      {
        onSuccess: () => {
          setLastSavedContent(newContent);
          setIsSaving(false);
          isUpdatingRef.current = false;

          syncNoteToPinecone(id, title, newContent);
        },
        onError: () => {
          toast({
            title: "Error saving changes",
            description: "Please try again",
            variant: "destructive",
          });
          setIsSaving(false);
          isUpdatingRef.current = false;
        },
      },
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
            "data-type": "mention",
          },
          suggestion: createSuggestion(id),
        }),
        // Mathematics.configure({
        //   shouldRender: defaultShouldRender,
        // }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Highlight.configure({
          multicolor: true,
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
                typeof p === "string" ? p : p.scheme,
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
              (note) =>
                note.title?.toLowerCase() === mentionTitle.toLowerCase(),
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

        lastUserEditTimeRef.current = Date.now();

        if (newContent !== content) {
          setContent(newContent);

          if (id) {
            handleEditorUpdate(newContent);
          } else if (!isCreatingNote) {
            createNote();
          }
        }
      },
    },
    [id, handleEditorUpdate],
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

    // Don't update if user edited content in the last 2 seconds
    const timeSinceLastEdit = Date.now() - lastUserEditTimeRef.current;
    if (timeSinceLastEdit < 2000) return;

    if (noteConnectionsQuery.isSuccess && lastSavedContent) {
      const currentMentions = extractNoteConnectionsFromContent(content);
      const savedMentions = extractNoteConnectionsFromContent(lastSavedContent);

      // Only update if mentions changed AND the editor is not currently focused
      if (
        currentMentions?.length !== savedMentions?.length &&
        !editor.isFocused
      ) {
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
  }, [id, setOpenNotes, title, content]);

  useEffect(() => {
    if (!editor) return;

    // Don't update if user edited content in the last 2 seconds
    const timeSinceLastEdit = Date.now() - lastUserEditTimeRef.current;
    if (timeSinceLastEdit < 2000) return;

    if (content !== editor.getHTML() && !editor.isFocused) {
      const { from, to } = editor.state.selection;

      const transaction = editor.state.tr.setMeta("avoidSave", true);
      editor.view.dispatch(transaction);

      editor.commands.setContent(content, false, {
        preserveWhitespace: "full",
      });

      // Restore cursor position
      editor.commands.setTextSelection({ from, to });
    }
  }, [editor, content]);

  useEffect(() => {
    if (initialNoteId) {
      const note = getNotesQuery.data?.find(
        (note) => note.id === initialNoteId,
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
    isSyncingToPinecone: isSyncing,
  };
};

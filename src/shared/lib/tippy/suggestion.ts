"use client";

import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { createClient } from "../supabase/client";

import MentionList from "./mention-list";

export default function createSuggestion(currentNoteId: string) {
  return {
    items: async ({ query }: { query: string }) => {
      const supabase = await createClient();
      const { data: notes } = await supabase.from("notes").select("*");

      if (!notes) {
        return [];
      }

      return notes
        .filter(
          (item) =>
            item.title &&
            item.title.toLowerCase().startsWith(query.toLowerCase())
        )
        .slice(0, 5);
    },

    render: () => {
      let component: any;
      let popup: any;

      return {
        onStart: (props: any) => {
          component = new ReactRenderer(MentionList, {
            props: {
              ...props,
              currentNoteId,
            },
            editor: props.editor,
          });

          if (!props.clientRect) {
            return;
          }

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
            theme: "custom",
            maxWidth: "none",
          });
        },

        onUpdate(props: any) {
          component?.updateProps(props);

          if (!props.clientRect) {
            return;
          }

          popup?.[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props: any) {
          if (props.event.key === "Escape") {
            popup?.[0].hide();
            return true;
          }

          return component?.ref?.onKeyDown(props);
        },

        onExit() {
          popup?.[0].destroy();
          component?.destroy();
        },
      };
    },
  };
}

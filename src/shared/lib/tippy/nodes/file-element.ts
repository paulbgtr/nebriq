import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { FileElement as FileElementComponent } from "@/shared/lib/tiptap/file-element";

export const FileElement = Node.create({
  name: "fileElement",
  group: "block",
  inline: false,
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      fileName: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-filename"),
        renderHTML: (attributes) => ({
          "data-filename": attributes.fileName,
        }),
      },
      filePath: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-filepath"),
        renderHTML: (attributes) => ({
          "data-filepath": attributes.filePath,
        }),
      },
      fileSize: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-filesize"),
        renderHTML: (attributes) => ({
          "data-filesize": attributes.fileSize,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="fileElement"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        "data-type": "fileElement",
        ...HTMLAttributes,
        class: "file-element",
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FileElementComponent);
  },
});

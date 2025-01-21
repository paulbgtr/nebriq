import { File } from "lucide-react";
import { NodeViewWrapper } from "@tiptap/react";
import { Node } from "@tiptap/core";

/**
 * Custom block for representing a file in tiptap editor
 */
export const FileElement = ({ node }: any) => {
  // todo: type
  return (
    <NodeViewWrapper className="file-element rounded-xl bg-primary/10 text-primary px-2 py-1 flex items-center gap-2">
      <File className="w-4 h-4" />
      <span>{node.attrs.fileName}</span>{" "}
    </NodeViewWrapper>
  );
};

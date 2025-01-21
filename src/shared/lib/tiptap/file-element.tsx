import { File } from "lucide-react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";

/**
 * Custom block for representing a file in tiptap editor
 */
export const FileElement = () => {
  return (
    <NodeViewWrapper className="custom-block rounded-xl bg-primary/10 text-primary px-2 py-1 flex items-center gap-2">
      <File className="w-4 h-4" />
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

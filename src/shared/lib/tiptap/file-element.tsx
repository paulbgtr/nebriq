import { File } from "lucide-react";
import { NodeViewWrapper } from "@tiptap/react";

/**
 * Custom block for representing a file in tiptap editor
 */
export const FileElement = ({ node }: any) => {
  // todo: type
  return (
    <NodeViewWrapper
      className="file-element rounded-xl bg-primary/10 text-primary px-2 py-1 flex items-center gap-2"
      data-file-path={node.attrs.filePath}
    >
      <File className="w-4 h-4" />
      <span>{node.attrs.fileName}</span>{" "}
    </NodeViewWrapper>
  );
};

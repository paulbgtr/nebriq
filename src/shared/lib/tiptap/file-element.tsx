import { NodeViewWrapper } from "@tiptap/react";
import { File } from "lucide-react";
import { formatFileSize } from "../utils";
import {} from "@tiptap/react";

export const FileElement = ({ node }: any) => {
  const { fileName, filePath, fileSize, fileType } = node.attrs;

  return (
    <NodeViewWrapper
      className="group file-element rounded-xl bg-primary/10
                 text-primary px-3 py-2 flex items-center gap-3 transition-colors
                 cursor-pointer select-none"
      data-file-path={filePath}
      data-file-type={fileType}
      title={`Open ${fileName}`}
    >
      <File className="w-4 h-4 flex-shrink-0" />

      <div className="flex flex-col min-w-0">
        <span className="truncate font-medium">{fileName}</span>
        {fileSize && (
          <span className="text-xs text-primary/70">
            {formatFileSize(fileSize)}
          </span>
        )}
      </div>
    </NodeViewWrapper>
  );
};

import { NodeViewWrapper } from "@tiptap/react";
import { File } from "lucide-react";
import { formatFileSize } from "../utils";
import { createClient } from "../supabase/client";
import { useToast } from "@/shared/hooks/use-toast";
import { saveAs } from "file-saver";
import { NodeViewProps } from "@tiptap/react";

export const FileElement = ({ node }: NodeViewProps) => {
  const { toast } = useToast();

  const { fileName, filePath, fileSize, fileType } = node.attrs;

  const handleDownload = async () => {
    const supabase = createClient();

    const url = filePath.split("files/")[1];

    const { data, error } = await supabase.storage.from("files").download(url);

    if (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "File not found",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    saveAs(data, fileName);
  };

  return (
    <NodeViewWrapper
      className="group file-element rounded-xl bg-primary/10 hover:bg-primary/15
                   text-primary px-3 py-2 flex items-center gap-3 transition-colors
                   cursor-default select-none relative"
      data-file-path={filePath}
      data-file-type={fileType}
      title={`Open ${fileName}`}
    >
      <File className="w-4 h-4 flex-shrink-0" />

      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate font-medium">{fileName}</span>
        {fileSize && (
          <span className="text-xs text-primary/70">
            {formatFileSize(fileSize)}
          </span>
        )}
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="ml-2 p-1.5 rounded-md hover:bg-primary/20 transition-colors
                     opacity-0 group-hover:opacity-100 focus:opacity-100
                     focus:outline-none focus:ring-2 focus:ring-primary/30"
        title={`Download ${fileName}`}
        aria-label={`Download ${fileName}`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      </button>
    </NodeViewWrapper>
  );
};

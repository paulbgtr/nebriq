import React from "react";
import { formatDate } from "../lib/utils";
import { Badge } from "./ui/badge";
import { formatHTMLNoteContent } from "../lib/utils";
import Link from "next/link";

type NoteProps = {
  id?: string;
  title?: string;
  content?: string;
  createdAt: Date;
  tags?: string[];
};

const NoteComponent = ({
  id,
  title,
  content,
  createdAt,
  tags = [],
}: NoteProps) => {
  const contentWithoutHTML = formatHTMLNoteContent(content || "");

  const shortenedContent =
    contentWithoutHTML.length > 30
      ? `${contentWithoutHTML.slice(0, 30).trim()}...`
      : contentWithoutHTML;

  return (
    <Link href={`/write?id=${id}`}>
      <div className="h-full flex flex-col justify-between p-4 mb-4 bg-card rounded-lg border border-border shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-primary/20 cursor-pointer">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground mb-3 group-hover:text-foreground/80 transition-colors">
            {shortenedContent}
          </p>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground group-hover:text-foreground/60 transition-colors">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div>{formatDate(createdAt)}</div>
        </div>
      </div>
    </Link>
  );
};

export const Note = React.memo(NoteComponent);

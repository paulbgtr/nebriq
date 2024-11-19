type NoteProps = {
  title: string;
  content: string;
  createdAt: Date;
};

export const Note = ({ title, content, createdAt }: NoteProps) => {
  const contentWithoutHTML = content.replace(/<[^>]*>/g, "");

  const shortenedContent =
    content.length > 30
      ? `${contentWithoutHTML.slice(0, 30).trim()}...`
      : contentWithoutHTML;

  return (
    <div className="h-full flex flex-col justify-between p-4 mb-4 bg-card rounded-lg border border-border shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-primary/20 cursor-pointer">
      <div>
        <h3 className="text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground mb-3 group-hover:text-foreground/80 transition-colors">
          {shortenedContent}
        </p>
      </div>
      <div className="text-sm text-muted-foreground group-hover:text-foreground/60 transition-colors">
        {createdAt.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>
    </div>
  );
};

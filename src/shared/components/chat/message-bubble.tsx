import { cn } from "@/shared/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

type MessageRole = "user" | "assistant";

interface MessageBubbleProps {
  role: MessageRole;
  content: string;
  className?: string;
  renderMarkdown?: boolean;
}

export const MessageBubble = ({
  role,
  content,
  className,
  renderMarkdown = false,
}: MessageBubbleProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex mb-4",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      <div
        className={cn(
          "py-2 px-4 rounded-2xl",
          "leading-relaxed",
          isUser
            ? "bg-muted/40 rounded-tr-sm text-sm"
            : "bg-transparent prose prose-sm max-w-none"
        )}
      >
        {renderMarkdown ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md text-[13px] my-3 !bg-black/80"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className={cn(
                      "px-1.5 py-0.5 rounded bg-muted/40 text-foreground/90 font-mono text-[85%]",
                      className
                    )}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              p({ children }) {
                return (
                  <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
                );
              },
              ul({ children }) {
                return (
                  <ul className="mb-3 last:mb-0 pl-6 space-y-1">{children}</ul>
                );
              },
              ol({ children }) {
                return (
                  <ol className="mb-3 last:mb-0 pl-6 space-y-1">{children}</ol>
                );
              },
              li({ children }) {
                return (
                  <li className="marker:text-muted-foreground/70">
                    {children}
                  </li>
                );
              },
              h1({ children }) {
                return (
                  <h1 className="text-xl font-semibold mt-5 mb-2">
                    {children}
                  </h1>
                );
              },
              h2({ children }) {
                return (
                  <h2 className="text-lg font-semibold mt-4 mb-2">
                    {children}
                  </h2>
                );
              },
              h3({ children }) {
                return (
                  <h3 className="text-base font-semibold mt-3 mb-1.5">
                    {children}
                  </h3>
                );
              },
              blockquote({ children }) {
                return (
                  <blockquote className="border-l-2 border-muted pl-3 italic text-muted-foreground/80 my-2">
                    {children}
                  </blockquote>
                );
              },
              a({ children, href }) {
                return (
                  <a
                    href={href}
                    className="text-primary hover:underline transition-all duration-200"
                  >
                    {children}
                  </a>
                );
              },
              table({ children }) {
                return (
                  <div className="overflow-x-auto mb-3">
                    <table className="min-w-full border-collapse text-sm">
                      {children}
                    </table>
                  </div>
                );
              },
              th({ children }) {
                return (
                  <th className="border border-muted/30 px-3 py-1.5 bg-muted/20 text-left font-medium">
                    {children}
                  </th>
                );
              },
              td({ children }) {
                return (
                  <td className="border border-muted/30 px-3 py-1.5">
                    {children}
                  </td>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        ) : (
          content
        )}
      </div>
    </div>
  );
};

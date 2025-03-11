import fs from "fs";
import path from "path";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";

export const metadata: Metadata = {
  title: "Changelog | Nebriq",
  description: "Track the latest updates and changes to Nebriq",
};

export default async function ChangelogPage() {
  const changelogPath = path.join(process.cwd(), "CHANGELOG.md");
  const changelogContent = fs.readFileSync(changelogPath, "utf8");

  return (
    <div className="container max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Changelog 🔥</h1>
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">
                {children}
              </h2>
            ),
            h3: ({ children }) => {
              // Add emoji for different sections
              const text = children?.toString() || "";
              let emoji = "";
              if (text.includes("Added")) emoji = "✨";
              if (text.includes("Changed")) emoji = "🔄";
              if (text.includes("Fixed")) emoji = "🐛";

              return (
                <h3 className="text-xl font-medium mt-6 mb-3 flex items-center gap-2">
                  {emoji && <span>{emoji}</span>}
                  {children}
                </h3>
              );
            },
            ul: ({ children }) => (
              <ul className="list-disc pl-6 space-y-2 mb-6">{children}</ul>
            ),
            li: ({ children }) => (
              <li className="text-muted-foreground hover:text-foreground transition-colors">
                {children}
              </li>
            ),
          }}
        >
          {changelogContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}

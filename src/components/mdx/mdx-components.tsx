"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MDXComponents } from "mdx/types";
import {
  Copy,
  Check,
  ExternalLink,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  Code,
  Terminal,
  FileText,
} from "lucide-react";

// Copy to clipboard component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className="absolute top-3 right-3 p-2 rounded-md bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}

const components: MDXComponents = {
  // Headings with better styling and anchor links
  h1: ({ children, ...props }) => (
    <h1
      className="text-4xl md:text-5xl font-bold mb-8 leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="text-3xl md:text-4xl font-bold mb-6 mt-12 text-foreground leading-tight border-b border-border/50 pb-4"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="text-2xl md:text-3xl font-bold mb-4 mt-10 text-foreground leading-tight"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className="text-xl md:text-2xl font-semibold mb-3 mt-8 text-foreground leading-tight"
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5
      className="text-lg md:text-xl font-semibold mb-3 mt-6 text-foreground leading-tight"
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6
      className="text-base md:text-lg font-semibold mb-2 mt-4 text-foreground leading-tight"
      {...props}
    >
      {children}
    </h6>
  ),

  // Paragraphs with better spacing
  p: ({ children, ...props }) => (
    <p className="mb-6 text-foreground/90 leading-relaxed text-lg" {...props}>
      {children}
    </p>
  ),

  // Enhanced links with external link indicator
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 underline underline-offset-2 decoration-primary/50 hover:decoration-primary transition-all duration-300 font-medium"
          {...props}
        >
          {children}
          <ExternalLink className="w-3 h-3" />
        </a>
      );
    }

    return (
      <Link
        href={href || "#"}
        className="text-primary hover:text-primary/80 underline underline-offset-2 decoration-primary/50 hover:decoration-primary transition-all duration-300 font-medium"
        {...props}
      >
        {children}
      </Link>
    );
  },

  // Enhanced lists with better spacing
  ul: ({ children, ...props }) => (
    <ul className="mb-6 pl-6 space-y-3 list-none text-foreground/90" {...props}>
      {React.Children.map(children, (child, index) => (
        <li key={index} className="relative flex items-start">
          <div className="w-2 h-2 bg-primary rounded-full mt-3 mr-4 flex-shrink-0" />
          <div className="flex-1">{child}</div>
        </li>
      ))}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="mb-6 pl-6 space-y-3 list-decimal text-foreground/90 marker:text-primary marker:font-bold"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed text-lg" {...props}>
      {children}
    </li>
  ),

  // Enhanced blockquotes
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-primary/50 pl-6 py-4 mb-6 italic text-foreground/80 bg-primary/5 rounded-r-lg relative overflow-hidden"
      {...props}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50" />
      <div className="relative z-10">{children}</div>
    </blockquote>
  ),

  // Enhanced inline code
  code: ({ children, ...props }) => (
    <code
      className="bg-muted/80 px-2 py-1 rounded-md text-sm font-mono text-primary border border-primary/20"
      {...props}
    >
      {children}
    </code>
  ),

  // Enhanced code blocks with copy functionality
  pre: ({ children, ...props }) => {
    const textContent = React.isValidElement(children)
      ? children.props?.children || ""
      : String(children);

    return (
      <div className="relative group mb-8">
        <pre
          className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl overflow-x-auto text-sm leading-relaxed border border-slate-700/50 shadow-2xl"
          {...props}
        >
          <code className="text-slate-100 font-mono">{children}</code>
        </pre>
        <CopyButton text={textContent} />
      </div>
    );
  },

  // Enhanced images with zoom and caption support
  img: ({ src, alt }) => (
    <div className="my-8 group">
      <div className="relative overflow-hidden rounded-xl border border-border/50 shadow-lg">
        <Image
          src={src || ""}
          alt={alt || ""}
          width={800}
          height={400}
          className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {alt && (
        <p className="text-sm text-muted-foreground text-center mt-3 italic">
          {alt}
        </p>
      )}
    </div>
  ),

  // Enhanced tables
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto mb-8 rounded-xl border border-border/50 shadow-sm">
      <table className="min-w-full divide-y divide-border/50" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-muted/30" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody className="bg-card/30 divide-y divide-border/50" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr className="hover:bg-muted/20 transition-colors duration-200" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th
      className="px-6 py-4 text-left text-sm font-bold text-foreground uppercase tracking-wider"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-6 py-4 text-sm text-foreground/90" {...props}>
      {children}
    </td>
  ),

  // Enhanced horizontal rule
  hr: ({ ...props }) => (
    <div className="my-12 flex items-center" {...props}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-4 w-2 h-2 bg-primary rounded-full" />
      <div className="flex-1 h-px bg-gradient-to-r from-border via-transparent to-transparent" />
    </div>
  ),

  // Enhanced text formatting
  strong: ({ children, ...props }) => (
    <strong className="font-bold text-foreground" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-foreground/90" {...props}>
      {children}
    </em>
  ),

  // Custom Alert component with different types
  Alert: ({ children, type = "info", title, ...props }) => {
    const typeConfig = {
      info: {
        icon: Info,
        bgColor: "bg-blue-50 dark:bg-blue-950/30",
        borderColor: "border-blue-200 dark:border-blue-800",
        textColor: "text-blue-800 dark:text-blue-200",
        iconColor: "text-blue-600 dark:text-blue-400",
      },
      warning: {
        icon: AlertTriangle,
        bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        textColor: "text-yellow-800 dark:text-yellow-200",
        iconColor: "text-yellow-600 dark:text-yellow-400",
      },
      error: {
        icon: XCircle,
        bgColor: "bg-red-50 dark:bg-red-950/30",
        borderColor: "border-red-200 dark:border-red-800",
        textColor: "text-red-800 dark:text-red-200",
        iconColor: "text-red-600 dark:text-red-400",
      },
      success: {
        icon: CheckCircle,
        bgColor: "bg-green-50 dark:bg-green-950/30",
        borderColor: "border-green-200 dark:border-green-800",
        textColor: "text-green-800 dark:text-green-200",
        iconColor: "text-green-600 dark:text-green-400",
      },
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    const IconComponent = config.icon;

    return (
      <div
        className={`border rounded-xl p-6 mb-6 ${config.bgColor} ${config.borderColor} ${config.textColor}`}
        {...props}
      >
        <div className="flex items-start gap-4">
          <IconComponent
            className={`w-6 h-6 mt-0.5 flex-shrink-0 ${config.iconColor}`}
          />
          <div className="flex-1">
            {title && <h4 className="font-semibold mb-2 text-lg">{title}</h4>}
            <div className="text-base leading-relaxed">{children}</div>
          </div>
        </div>
      </div>
    );
  },

  // Custom Callout component
  Callout: ({ children, emoji = "💡", title, ...props }) => (
    <div
      className="bg-primary/5 border-l-4 border-primary p-6 mb-6 rounded-r-xl relative overflow-hidden"
      {...props}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50" />
      <div className="flex items-start gap-4">
        <span className="text-3xl flex-shrink-0">{emoji}</span>
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold text-foreground mb-2 text-lg">
              {title}
            </h4>
          )}
          <div className="text-foreground/90 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  ),

  // Custom CodeBlock component with language and filename support
  CodeBlock: ({
    children,
    language = "javascript",
    filename,
    title,
    ...props
  }) => {
    const textContent = String(children);

    return (
      <div className="mb-8 group">
        {(filename || title) && (
          <div className="bg-slate-800 text-slate-300 px-6 py-3 text-sm font-mono rounded-t-xl border-b border-slate-700/50 flex items-center gap-3">
            {filename && (
              <>
                <FileText className="w-4 h-4" />
                <span>{filename}</span>
              </>
            )}
            {title && !filename && (
              <>
                <Code className="w-4 h-4" />
                <span>{title}</span>
              </>
            )}
            {language && (
              <span className="ml-auto px-2 py-1 bg-slate-700/50 rounded text-xs uppercase">
                {language}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <pre
            className={`bg-gradient-to-br from-slate-900 to-slate-800 p-6 ${
              filename || title ? "rounded-b-xl" : "rounded-xl"
            } overflow-x-auto text-sm leading-relaxed border border-slate-700/50 shadow-2xl`}
            {...props}
          >
            <code className={`text-slate-100 font-mono language-${language}`}>
              {children}
            </code>
          </pre>
          <CopyButton text={textContent} />
        </div>
      </div>
    );
  },

  // Terminal component for command examples
  Terminal: ({ children, ...props }) => (
    <div className="mb-8 group">
      <div className="bg-slate-900 rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="bg-slate-800 px-6 py-3 flex items-center gap-3 border-b border-slate-700/50">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300 text-sm font-mono">Terminal</span>
          <div className="ml-auto flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
        </div>
        <div className="relative">
          <pre
            className="p-6 text-sm font-mono text-green-400 bg-slate-900"
            {...props}
          >
            <code>{children}</code>
          </pre>
          <CopyButton text={String(children)} />
        </div>
      </div>
    </div>
  ),

  // Interactive Counter component (example of interactive MDX)
  Counter: () => {
    const [count, setCount] = useState(0);

    return (
      <div className="flex items-center justify-center gap-4 p-6 bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl mb-6">
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors duration-200"
        >
          -
        </button>
        <span className="text-3xl font-bold text-foreground min-w-[3rem] text-center">
          {count}
        </span>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors duration-200"
        >
          +
        </button>
      </div>
    );
  },

  // Note component for important information
  Note: ({ children, ...props }) => (
    <div
      className="bg-muted/30 border border-border/50 rounded-xl p-6 mb-6 relative overflow-hidden"
      {...props}
    >
      <div className="flex items-start gap-4">
        <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1 text-foreground/90 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  ),
};

export default components;

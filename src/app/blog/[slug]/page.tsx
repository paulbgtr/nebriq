import { notFound } from "next/navigation";
import { getAllPostSlugs, getPostBySlug, formatDate } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import mdxComponents from "@/components/mdx/mdx-components";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  BookOpen,
  Coffee,
} from "lucide-react";
import { ReadingProgress } from "@/shared/components/reading-progress/reading-progress";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();

  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      images: post.image
        ? [
            {
              url: post.image,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-primary/2 rounded-full blur-3xl" />
      </div>

      <ReadingProgress />

      <div className="relative max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link
              href="/blog"
              className="hover:text-primary transition-colors duration-300"
            >
              Blog
            </Link>
            <span>/</span>
            <span className="text-foreground">{post.title}</span>
          </div>
        </nav>

        {/* Article Header */}
        <header>
          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Article
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            {post.description}
          </p>

          {/* Author & Meta Info */}
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-border/50">
            {post.author && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{post.author}</p>
                  <p className="text-sm text-muted-foreground">Author</p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime}</span>
              </div>

              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4" />
                <span>Easy read</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full border border-primary/20 hover:bg-primary/15 transition-colors duration-300"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <article className="mb-16">
          <div className="bg-card/30 backdrop-blur-sm rounded-2xl overflow-hidden">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <MDXRemote source={post.content} components={mdxComponents} />
            </div>
          </div>
        </article>

        {/* Article Footer */}
        <footer className="space-y-8">
          {/* Share Section */}
          <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-8">
            <div className="text-center">
              <Share2 className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Found this helpful?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Share this article with others who might find it useful, or let
                us know your thoughts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors duration-300">
                  Share Article
                </button>
                <Link
                  href="/blog"
                  className="px-6 py-3 border border-border hover:bg-accent text-foreground rounded-lg font-medium transition-colors duration-300"
                >
                  More Articles
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

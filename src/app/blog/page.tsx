import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, User, Tag, ArrowRight, BookOpen } from "lucide-react";

export const metadata = {
  title: "Blog",
  description: "Latest articles and insights from the Nebriq team",
};

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Knowledge Hub
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-6 leading-tight">
            Latest Insights
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the latest articles, tutorials, and insights from our team.
            Stay updated with cutting-edge developments and best practices.
          </p>
        </div>

        {/* Posts Section */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted/30 rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              No posts yet
            </h3>
            <p className="text-muted-foreground">
              Check back soon for our latest articles and insights.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {posts.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
                    Featured Article
                  </h2>
                </div>

                <article className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
                  <div className="md:flex">
                    {/* Featured Image */}
                    {posts[0].image && (
                      <div className="md:w-1/2 relative overflow-hidden">
                        <div className="relative h-64 md:h-80">
                          <Image
                            src={posts[0].image}
                            alt={posts[0].title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div
                      className={`p-8 md:p-12 ${posts[0].image ? "md:w-1/2" : "w-full"} flex flex-col justify-center`}
                    >
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <time dateTime={posts[0].date}>
                            {formatDate(posts[0].date)}
                          </time>
                        </div>

                        {posts[0].author && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{posts[0].author}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{posts[0].readingTime}</span>
                        </div>
                      </div>

                      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors duration-300">
                        <Link href={`/blog/${posts[0].slug}`}>
                          {posts[0].title}
                        </Link>
                      </h2>

                      <p className="text-lg text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                        {posts[0].description}
                      </p>

                      {/* Tags */}
                      {posts[0].tags && posts[0].tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                          {posts[0].tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <Link
                        href={`/blog/${posts[0].slug}`}
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-all duration-300 group/link"
                      >
                        Read Full Article
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            )}

            {/* More Articles Grid */}
            {posts.length > 1 && (
              <>
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">
                    More Articles
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {posts.slice(1).map((post) => (
                    <article
                      key={post.slug}
                      className="group bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Image */}
                      {post.image && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <time dateTime={post.date}>
                              {formatDate(post.date)}
                            </time>
                          </div>

                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{post.readingTime}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors duration-300">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>

                        <p className="text-muted-foreground mb-4 leading-relaxed text-sm line-clamp-3">
                          {post.description}
                        </p>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {post.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                              >
                                <Tag className="w-2 h-2" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-sm transition-all duration-300 group/link"
                        >
                          Read More
                          <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover/link:translate-x-0.5" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

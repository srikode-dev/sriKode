import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar, Clock, ArrowLeft, ArrowRight, Tag, User,
  Eye, Heart, Bookmark, ChevronRight, ExternalLink, Code2, Play
} from "lucide-react";
import { formatDate } from "@/data";
import { getBlogs, getBlogBySlug } from "@/lib/api";
import Container from "@/components/shared/Container";
import Sidebar from "@/components/home/sidebar/Sidebar";
import TableOfContents from "@/components/blog/TableOfContents";
import ArticleContent from "@/components/blog/ArticleContent";
import CommentSection from "@/components/blog/CommentSection";

export async function generateStaticParams() {
  try {
    const res = await getBlogs({ limit: 100 });
    return res.blogs?.map((b) => ({ slug: b.slug })) || [];
  } catch (error) {
    console.error("Error generating static params for blogs: ", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await getBlogBySlug(slug);
    const blog = res.blog;
    if (!blog) return {};
    return {
      title: blog.title,
      description: blog.excerpt,
      alternates: {
        canonical: `/blog/${slug}`,
      },
      openGraph: {
        title: blog.title,
        description: blog.excerpt,
        images: [{ url: blog.coverImage }],
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;

  let blog = null;
  let prevBlog = null;
  let nextBlog = null;
  let dbBlogs = [];

  try {
    const res = await getBlogBySlug(slug);
    blog = res.blog;

    const listRes = await getBlogs({ limit: 100 });
    dbBlogs = listRes.blogs || [];

    const currentIndex = dbBlogs.findIndex((b) => b.slug === slug);
    prevBlog = currentIndex > 0 ? dbBlogs[currentIndex - 1] : null;
    nextBlog = currentIndex < dbBlogs.length - 1 ? dbBlogs[currentIndex + 1] : null;
  } catch (error) {
    console.error("Failed to load blog page dynamically: ", error);
  }

  if (!blog) notFound();

  const relatedBlogs = blog.relatedPosts || [];

  // Dynamically generate table of contents items from headings inside the article content
  const tocItems = blog.content
    ? blog.content
        .filter((block) => block.type === "heading")
        .map((block) => ({
          id: block.text.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title: block.text,
        }))
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "image": blog.coverImage,
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt || blog.createdAt,
    "author": {
      "@type": "Person",
      "name": blog.author?.name || "Srikant Sahu",
      "url": "https://srikode.dev/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SriKode",
      "logo": {
        "@type": "ImageObject",
        "url": "https://srikode.dev/favicon.ico"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://srikode.dev/blog/${blog.slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Breadcrumb & Title Area ── */}
      <div className="pt-4 pb-8 border-b border-sk-border">
        <Container>
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-sk-text-faint font-medium">
            <Link href="/" className="hover:text-sk-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/blogs" className="hover:text-sk-primary transition-colors">Blogs</Link>
            <ChevronRight size={12} />
            <span className="text-sk-text-muted line-clamp-1 max-w-[200px] sm:max-w-xs">{blog.title}</span>
          </nav>

          <span className="inline-block rounded-full bg-sk-primary-light px-3 py-1 text-[11px] font-black uppercase tracking-wider text-sk-primary-text">
            {blog.category}
          </span>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-sk-text sm:text-4xl md:text-5xl max-w-4xl">
            {blog.title}
          </h1>
        </Container>
      </div>

      {/* ── Body ── */}
      <div className="py-10">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">

            {/* ── Left: Article ── */}
            <article className="min-w-0">
              {/* Author / Meta Bar */}
              <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-sk-border pb-6 text-sm text-sk-text-muted">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-sk-text-faint" />
                  <span className="font-semibold text-sk-text">{blog.author?.name || "Srikant Sahu"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-sk-text-faint" />
                  {formatDate(blog.createdAt)}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-sk-text-faint" />
                  {blog.readingTime}
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye size={14} className="text-sk-text-faint" />
                  {(blog.viewCount || 0).toLocaleString()} views
                </div>
              </div>

              {/* Cover Image Card */}
              <div className="relative aspect-21/9 w-full overflow-hidden rounded-2xl bg-sk-bg-subtle shadow-xs border border-sk-border mb-8">
                <Image
                  src={blog.coverImage || "https://picsum.photos/seed/blog/800/400"}
                  alt={blog.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </div>

              {/* Excerpt lead */}
              <p className="mb-8 text-lg leading-relaxed text-sk-text-muted border-l-4 border-sk-primary pl-5 italic">
                {blog.excerpt}
              </p>

              {/* Table of Contents (mobile) */}
              {tocItems.length > 0 && (
                <div className="mb-8 lg:hidden">
                  <TableOfContents items={tocItems} />
                </div>
              )}

              {/* Article body */}
              <ArticleContent content={blog.content} toc={tocItems} />

              {/* Optional Video Walkthrough Section */}
              {blog.videoUrl && (
                <div className="mt-12 space-y-4">
                  <h3 className="text-lg font-extrabold text-sk-text flex items-center gap-2">
                    <Play className="text-red-500" size={20} fill="currentColor" />
                    Video Walkthrough Tutorial
                  </h3>
                  <div className="overflow-hidden rounded-xl border border-sk-border">
                    <div className="relative aspect-video">
                      <iframe
                        src={blog.videoUrl.replace("watch?v=", "embed/")}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                        title="Walkthrough video"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons (Live Demo & Source Code) */}
              {(blog.liveUrl || blog.demoUrl || blog.githubUrl || blog.sourceCodeUrl) && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 rounded-2xl border border-sk-border bg-sk-bg-subtle p-6 select-none">
                  {(blog.liveUrl || blog.demoUrl) && (
                    <a
                      href={blog.liveUrl || blog.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-sk-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sk-primary-hover hover:shadow active:scale-[0.98]"
                    >
                      <ExternalLink size={16} />
                      Live Demo
                    </a>
                  )}
                  {(blog.githubUrl || blog.sourceCodeUrl) && (
                    <a
                      href={blog.githubUrl || blog.sourceCodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-sk-border bg-sk-bg-card px-6 py-3 text-sm font-semibold text-sk-text-muted shadow-xs transition hover:bg-sk-primary-light hover:text-sk-primary active:scale-[0.98]"
                    >
                      <Code2 size={16} />
                      Source Code
                    </a>
                  )}
                </div>
              )}

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-sk-border pt-6">
                  <Tag size={14} className="text-sk-text-faint" />
                  {blog.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blogs?search=${tag}`}
                      className="rounded-full border border-sk-border bg-sk-bg-card px-3 py-1 text-xs text-sk-text-muted transition-colors duration-200 hover:border-sk-primary hover:bg-sk-primary-light hover:text-sk-primary"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Prev / Next navigation */}
              <div className="mt-10 grid grid-cols-1 gap-4 border-t border-sk-border pt-8 sm:grid-cols-2">
                {prevBlog ? (
                  <Link
                    href={`/blog/${prevBlog.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-sk-border bg-sk-bg-card p-4 transition hover:border-sk-primary hover:bg-sk-primary-light/30"
                  >
                    <ArrowLeft size={18} className="shrink-0 text-sk-text-faint transition-colors group-hover:text-sk-primary" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-sk-text-faint">Previous</p>
                      <p className="line-clamp-1 text-sm font-bold text-sk-text group-hover:text-sk-primary">
                        {prevBlog.title}
                      </p>
                    </div>
                  </Link>
                ) : <div />}

                {nextBlog && (
                  <Link
                    href={`/blog/${nextBlog.slug}`}
                    className="group flex items-center justify-end gap-3 rounded-xl border border-sk-border bg-sk-bg-card p-4 text-right transition hover:border-sk-primary hover:bg-sk-primary-light/30"
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-sk-text-faint">Next</p>
                      <p className="line-clamp-1 text-sm font-bold text-sk-text group-hover:text-sk-primary">
                        {nextBlog.title}
                      </p>
                    </div>
                    <ArrowRight size={18} className="shrink-0 text-sk-text-faint transition-colors group-hover:text-sk-primary" />
                  </Link>
                )}
              </div>

              {/* Related Posts */}
              {relatedBlogs.length > 0 && (
                <div className="mt-12 border-t border-sk-border pt-10">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-4 w-1 rounded-full bg-sk-primary" />
                    <h2 className="text-lg font-bold uppercase tracking-widest text-sk-text">Related Posts</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {relatedBlogs.map((rb) => (
                      <Link key={rb._id || rb.id} href={`/blog/${rb.slug}`} className="group block overflow-hidden rounded-xl border border-sk-border bg-sk-bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className="relative aspect-video overflow-hidden">
                          <Image src={rb.coverImage || "https://picsum.photos/seed/related/300/200"} alt={rb.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="300px" />
                        </div>
                        <div className="p-3">
                          <span className="text-[10px] font-semibold uppercase text-sk-primary">{rb.category}</span>
                          <p className="mt-1 line-clamp-2 text-sm font-bold text-sk-text group-hover:text-sk-primary">{rb.title}</p>
                          <p className="mt-1 text-[11px] text-sk-text-faint">{formatDate(rb.createdAt)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Comment Section */}
              <CommentSection blogId={blog._id || blog.id} slug={blog.slug} />
            </article>

            {/* ── Right: Sticky Sidebar ── */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              {/* Table of Contents (desktop) */}
              {tocItems.length > 0 && (
                <div className="mb-6">
                  <TableOfContents items={tocItems} />
                </div>
              )}
              <Sidebar blogs={dbBlogs} />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

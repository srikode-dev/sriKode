import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar, Clock, ArrowLeft, ArrowRight, Tag, User,
  Eye, Heart, Bookmark, ChevronRight, ExternalLink, Code2
} from "lucide-react";
import { blogs, getRelatedBlogs, formatDate } from "@/data";
import Container from "@/components/shared/Container";
import Sidebar from "@/components/home/sidebar/Sidebar";
import TableOfContents from "@/components/blog/TableOfContents";
import ArticleContent from "@/components/blog/ArticleContent";
import CommentSection from "@/components/blog/CommentSection";

export async function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);
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
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) notFound();

  const currentIndex = blogs.findIndex((b) => b.slug === slug);
  const prevBlog = currentIndex > 0 ? blogs[currentIndex - 1] : null;
  const nextBlog = currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null;
  const relatedBlogs = getRelatedBlogs(blog.id, blog.category, 3);

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
    "datePublished": blog.publishedAt,
    "dateModified": blog.updatedAt || blog.publishedAt,
    "author": {
      "@type": "Person",
      "name": blog.author.name,
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
      <div className="py-8 border-b border-gray-150/40">
        <Container>
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-gray-400 font-medium">
            <Link href="/" className="hover:text-blue-650 transition">Home</Link>
            <ChevronRight size={12} />
            <Link href="/blogs" className="hover:text-blue-650 transition">Blogs</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600 line-clamp-1 max-w-[200px] sm:max-w-xs">{blog.title}</span>
          </nav>

          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-blue-600">
            {blog.category}
          </span>
          <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl max-w-4xl">
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
              <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-gray-150/50 pb-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gray-400" />
                  <span className="font-semibold text-gray-700">{blog.author.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-gray-400" />
                  {formatDate(blog.publishedAt)}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-400" />
                  {blog.readingTime}
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye size={14} className="text-gray-400" />
                  {blog.views?.toLocaleString()} views
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <button aria-label="Like" className="flex items-center gap-1 rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-red-300 hover:text-red-500 hover:bg-red-50/20">
                    <Heart size={13} /> {blog.likes}
                  </button>
                  <button aria-label="Bookmark" className="flex items-center gap-1 rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/20">
                    <Bookmark size={13} /> Save
                  </button>
                </div>
              </div>

              {/* Cover Image Card */}
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-black/[0.03] mb-8">
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                />
              </div>

              {/* Excerpt lead */}
              <p className="mb-8 text-lg leading-relaxed text-gray-600 border-l-4 border-blue-500 pl-5 italic">
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

              {/* Action buttons (Live Demo & Source Code) */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 select-none">
                <a
                  href={blog.demoUrl || "https://demo.srikode.dev"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow active:scale-[0.98]"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
                <a
                  href={blog.sourceCodeUrl || "https://github.com/srikode-dev/srikode-tutorials"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98]"
                >
                  <Code2 size={16} />
                  Source Code
                </a>
              </div>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-6">
                  <Tag size={14} className="text-gray-400" />
                  {blog.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blogs?search=${tag}`}
                      className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Prev / Next navigation */}
              <div className="mt-10 grid grid-cols-1 gap-4 border-t border-gray-100 pt-8 sm:grid-cols-2">
                {prevBlog ? (
                  <Link
                    href={`/blog/${prevBlog.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-gray-100 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <ArrowLeft size={18} className="shrink-0 text-gray-400 transition group-hover:text-blue-600" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400">Previous</p>
                      <p className="line-clamp-1 text-sm font-semibold text-gray-800 group-hover:text-blue-600">
                        {prevBlog.title}
                      </p>
                    </div>
                  </Link>
                ) : <div />}

                {nextBlog && (
                  <Link
                    href={`/blog/${nextBlog.slug}`}
                    className="group flex items-center justify-end gap-3 rounded-xl border border-gray-100 p-4 text-right transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400">Next</p>
                      <p className="line-clamp-1 text-sm font-semibold text-gray-800 group-hover:text-blue-600">
                        {nextBlog.title}
                      </p>
                    </div>
                    <ArrowRight size={18} className="shrink-0 text-gray-400 transition group-hover:text-blue-600" />
                  </Link>
                )}
              </div>

              {/* Related Posts */}
              {relatedBlogs.length > 0 && (
                <div className="mt-12 border-t border-gray-100 pt-10">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-4 w-1 rounded-full bg-blue-600" />
                    <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800">Related Posts</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {relatedBlogs.map((rb) => (
                      <Link key={rb.id} href={`/blog/${rb.slug}`} className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className="relative aspect-video overflow-hidden">
                          <Image src={rb.coverImage} alt={rb.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="300px" />
                        </div>
                        <div className="p-3">
                          <span className="text-[10px] font-semibold uppercase text-blue-600">{rb.category}</span>
                          <p className="mt-1 line-clamp-2 text-sm font-bold text-gray-800 group-hover:text-blue-600">{rb.title}</p>
                          <p className="mt-1 text-[11px] text-gray-400">{formatDate(rb.publishedAt)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Comment Section */}
              <CommentSection blogId={blog.id} />
            </article>

            {/* ── Right: Sticky Sidebar ── */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              {/* Table of Contents (desktop) */}
              {tocItems.length > 0 && (
                <div className="mb-6">
                  <TableOfContents items={tocItems} />
                </div>
              )}
              <Sidebar blogs={blogs} />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

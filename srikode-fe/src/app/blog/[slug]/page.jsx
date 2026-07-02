import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar, Clock, ArrowLeft, ArrowRight, Tag, User,
  Eye, Heart, Bookmark, ChevronRight,
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
      {/* ── Hero Cover ── */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-900 md:h-80 lg:h-96">
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          priority
          className="object-cover opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute left-0 top-0 w-full px-6 pt-6">
          <nav className="mx-auto flex max-w-7xl items-center gap-2 text-xs text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight size={12} />
            <Link href="/blogs" className="hover:text-white">Blogs</Link>
            <ChevronRight size={12} />
            <span className="text-white/90 line-clamp-1 max-w-xs">{blog.title}</span>
          </nav>
        </div>

        {/* Title area */}
        <div className="absolute bottom-0 left-0 w-full px-6 pb-8">
          <div className="mx-auto max-w-7xl">
            <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              {blog.category}
            </span>
            <h1 className="mt-3 max-w-3xl text-2xl font-extrabold leading-snug text-white md:text-3xl lg:text-4xl">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="py-10">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">

            {/* ── Left: Article ── */}
            <article>
              {/* Author / Meta Bar */}
              <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-gray-100 pb-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span className="font-semibold text-gray-700">{blog.author.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(blog.publishedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {blog.readingTime}
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  {blog.views?.toLocaleString()} views
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <button aria-label="Like" className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs transition hover:border-red-300 hover:text-red-500">
                    <Heart size={13} /> {blog.likes}
                  </button>
                  <button aria-label="Bookmark" className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-xs transition hover:border-blue-300 hover:text-blue-500">
                    <Bookmark size={13} /> Save
                  </button>
                </div>
              </div>

              {/* Excerpt lead */}
              <p className="mb-8 text-lg leading-relaxed text-gray-600 border-l-4 border-blue-500 pl-5 italic">
                {blog.excerpt}
              </p>

              {/* Table of Contents (mobile) */}
              {blog.tableOfContents?.length > 0 && (
                <div className="mb-8 lg:hidden">
                  <TableOfContents items={blog.tableOfContents} />
                </div>
              )}

              {/* Article body */}
              <ArticleContent content={blog.content} />

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
              {blog.tableOfContents?.length > 0 && (
                <div className="mb-6">
                  <TableOfContents items={blog.tableOfContents} />
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

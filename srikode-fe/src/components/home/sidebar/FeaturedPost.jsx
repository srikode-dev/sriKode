import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

import { formatDate } from "@/data";

export default function FeaturedPost({ blog, blogs, posts }) {
  // Normalize candidate posts: supports blog object/array, blogs array, or posts array
  let candidates = [];
  if (Array.isArray(blogs) && blogs.length > 0) {
    candidates = blogs;
  } else if (Array.isArray(posts) && posts.length > 0) {
    candidates = posts;
  } else if (Array.isArray(blog) && blog.length > 0) {
    candidates = blog;
  } else if (blog) {
    candidates = [blog];
  }

  // Prioritize posts explicitly flagged as isFeatured if available
  const explicitFeatured = candidates.filter((item) => item?.isFeatured);
  const pool = explicitFeatured.length > 0 ? explicitFeatured : candidates;

  if (pool.length === 0) return null;

  // If multiple posts are selected, pick one randomly on each page load
  const selectedBlog = pool.length === 1
    ? pool[0]
    : pool[Math.floor(Math.random() * pool.length)];

  if (!selectedBlog) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-sk-border bg-sk-bg-card shadow-sm transition-all duration-300">
      {/* Heading */}
      <div className="flex items-center gap-3 border-b border-sk-border px-4 py-3">
        <span className="h-4 w-1 rounded-full bg-sk-primary" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-sk-text">
          Featured Post
        </h3>
      </div>

      <Link href={`/blog/${selectedBlog.slug}`} className="group block p-4">
        {/* Cover image */}
        <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={selectedBlog.coverImage || "/placeholder-banner.webp"}
            alt={selectedBlog.title || "Featured post"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 300px"
          />
          {/* Category badge */}
          {selectedBlog.category && (
            <span className="absolute left-2 top-2 rounded-full bg-sk-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              {selectedBlog.category}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="line-clamp-3 text-sm font-bold leading-snug text-sk-text transition-colors group-hover:text-sk-primary">
          {selectedBlog.title}
        </h4>

        {/* Meta */}
        <div className="mt-2 flex items-center gap-3 text-[11px] text-sk-text-faint">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(selectedBlog.publishedAt || selectedBlog.createdAt) || selectedBlog.publishedAt}
          </span>
          {selectedBlog.readingTime && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {selectedBlog.readingTime}
            </span>
          )}
        </div>
      </Link>

      {/* View All Button */}
      <div className="border-t border-sk-border p-3">
        <Link
          href="/blogs"
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-sk-border bg-sk-bg-subtle/60 py-2.5 text-xs font-semibold text-sk-text transition-all duration-200 hover:border-sk-primary hover:bg-sk-primary hover:text-white active:scale-[0.99]"
        >
          <span>View All</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { formatDate } from "@/data";

export default function BlogCard({ blog }) {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      style={{
        backgroundColor: "var(--sk-bg-card)",
        border: "1px solid var(--sk-border)",
      }}
    >
      {/* Thumbnail */}
      <Link href={`/blog/${blog.slug}`} className="relative block aspect-video overflow-hidden">
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Category Badge */}
        <span
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow"
          style={{ backgroundColor: "var(--sk-primary)" }}
        >
          {blog.category}
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/blog/${blog.slug}`}>
          <h3
            className="line-clamp-2 text-base font-bold leading-snug transition-colors"
            style={{ color: "var(--sk-text)" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--sk-primary)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--sk-text)"}
          >
            {blog.title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm" style={{ color: "var(--sk-text-muted)" }}>
          {blog.excerpt}
        </p>

        {/* Meta */}
        <div
          className="mt-auto flex items-center gap-4 pt-4 text-xs"
          style={{ color: "var(--sk-text-faint)" }}
        >
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(blog.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {blog.readingTime}
          </span>
        </div>
      </div>
    </article>
  );
}

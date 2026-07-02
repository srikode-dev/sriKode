import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { formatDate } from "@/data";

export default function BlogCard({ blog }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Thumbnail */}
      <Link href={`/blog/${blog.slug}`} className="relative block aspect-[16/9] overflow-hidden">
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Category Badge */}
        <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow">
          {blog.category}
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/blog/${blog.slug}`}>
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
            {blog.title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
          {blog.excerpt}
        </p>

        {/* Meta */}
        <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-gray-400">
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

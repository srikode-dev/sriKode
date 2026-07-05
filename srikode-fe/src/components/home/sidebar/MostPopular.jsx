import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";

import { formatDate } from "@/data";

export default function MostPopular({ blogs }) {
  // Sort by views descending, take top 5
  const popular = [...blogs]
    .sort((a, b) => (b.viewCount || b.views || 0) - (a.viewCount || a.views || 0))
    .slice(0, 5);

  return (
    <div className="overflow-hidden rounded-xl border border-sk-border bg-sk-bg-card shadow-sm transition-all duration-300">
      {/* Heading */}
      <div className="flex items-center gap-3 border-b border-sk-border px-4 py-3">
        <span className="h-4 w-1 rounded-full bg-sk-primary" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-sk-text">
          Most Popular
        </h3>
      </div>

      <ul className="divide-y divide-sk-border px-4 py-2">
        {popular.map((blog) => (
          <li key={blog._id || blog.id} className="group py-3">
            <Link href={`/blog/${blog.slug}`} className="flex items-start gap-3">
              {/* Thumbnail */}
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={blog.coverImage || "https://picsum.photos/seed/popular/150/100"}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="96px"
                />
              </div>

              {/* Text */}
              <div className="flex flex-1 flex-col justify-between">
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-sk-text transition-colors group-hover:text-sk-primary">
                  {blog.title}
                </p>
                <span className="mt-1 flex items-center gap-1 text-[11px] text-sk-text-faint">
                  <Calendar size={11} />
                  {formatDate(blog.publishedAt || blog.createdAt)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

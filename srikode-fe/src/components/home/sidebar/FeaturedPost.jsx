import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

export default function FeaturedPost({ blog }) {
  if (!blog) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* Heading */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <span className="h-4 w-1 rounded-full bg-blue-600" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800">
          Featured Post
        </h3>
      </div>

      <Link href={`/blog/${blog.slug}`} className="group block p-4">
        {/* Cover image */}
        <div className="relative mb-3 aspect-[16/9] w-full overflow-hidden rounded-lg">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 300px"
          />
          {/* Category badge */}
          <span className="absolute left-2 top-2 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            {blog.category}
          </span>
        </div>

        {/* Title */}
        <h4 className="line-clamp-3 text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600">
          {blog.title}
        </h4>

        {/* Meta */}
        <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {blog.publishedAt}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {blog.readingTime}
          </span>
        </div>
      </Link>
    </div>
  );
}

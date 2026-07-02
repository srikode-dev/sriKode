import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default function MostPopular({ blogs }) {
  // Sort by views descending, take top 5
  const popular = [...blogs]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* Heading */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <span className="h-4 w-1 rounded-full bg-blue-600" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800">
          Most Popular
        </h3>
      </div>

      <ul className="divide-y divide-gray-50 px-4 py-2">
        {popular.map((blog) => (
          <li key={blog.id} className="group py-3">
            <Link href={`/blog/${blog.slug}`} className="flex items-start gap-3">
              {/* Thumbnail */}
              <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="96px"
                />
              </div>

              {/* Text */}
              <div className="flex flex-1 flex-col justify-between">
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-gray-800 transition-colors group-hover:text-blue-600">
                  {blog.title}
                </p>
                <span className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
                  <Calendar size={11} />
                  {blog.publishedAt}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

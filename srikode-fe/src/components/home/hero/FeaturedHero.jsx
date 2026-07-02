import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function FeaturedHero({ blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group relative block h-145 overflow-hidden rounded-3xl"
    >
      <Image
        src={blog.coverImage}
        alt={blog.title}
        fill
        priority
        className="object-cover transition duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-10 text-white">
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold uppercase">
            {blog.category}
          </span>

          <span className="text-sm text-white/80">
            {blog.readingTime}
          </span>
        </div>

        <h1 className="max-w-3xl text-5xl font-bold leading-tight transition group-hover:text-blue-300">
          {blog.title}
        </h1>

        <p className="mt-5 max-w-2xl text-lg text-white/90">
          {blog.excerpt}
        </p>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <span>{blog.author.name}</span>
            <span>•</span>
            <span>{blog.publishedAt}</span>
          </div>

          <span className="flex items-center gap-2 text-sm font-semibold">
            Read Article
            <ArrowRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default FeaturedHero;
import Image from "next/image";
import Link from "next/link";

function HeroSideCard({ blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group relative h-46 overflow-hidden rounded-3xl"
    >
      <Image
        src={blog.coverImage}
        alt={blog.title}
        fill
        className="object-cover transition duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full p-5 text-white">
        <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold uppercase">
          {blog.category}
        </span>

        <h3 className="mt-3 line-clamp-2 text-xl font-bold leading-tight transition group-hover:text-blue-300">
          {blog.title}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-xs text-white/70">
          <span>{blog.author.name}</span>
          <span>•</span>
          <span>{blog.publishedAt}</span>
        </div>
      </div>
    </Link>
  );
}

export default HeroSideCard;
import Link from "next/link";
import { Home, BookOpen, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-20 text-center">
      {/* Big 404 */}
      <div className="relative mb-6 select-none">
        <span className="text-[140px] font-extrabold leading-none text-gray-100 md:text-[180px]">
          404
        </span>
        <span className="absolute inset-0 flex items-center justify-center text-5xl md:text-6xl">
          😵
        </span>
      </div>

      <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
        Page Not Found
      </h1>
      <p className="mx-auto mt-3 max-w-md text-gray-500">
        Oops — looks like this page got lost in the code. It might have been moved, deleted or never existed.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
        >
          <Home size={15} />
          Go Home
        </Link>
        <Link
          href="/blogs"
          className="flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-blue-400 hover:text-blue-600"
        >
          <BookOpen size={15} />
          Browse Tutorials
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Quick links */}
      <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Popular Pages
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "HTML & CSS", href: "/category/html-css" },
            { label: "JavaScript", href: "/category/javascript" },
            { label: "React", href: "/category/react" },
            { label: "Next.js", href: "/category/next-js" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact-us" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-600 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

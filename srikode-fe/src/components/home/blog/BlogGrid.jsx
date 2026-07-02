"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BlogCard from "./BlogCard";

const POSTS_PER_PAGE = 6;

export default function BlogGrid({ blogs }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(blogs.length / POSTS_PER_PAGE);

  const paginated = blogs.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const goTo = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {/* Section heading */}
      <div className="mb-6 flex items-center gap-3">
        <span className="h-5 w-1 rounded-full bg-blue-600" />
        <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800">
          Recent Posts
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {paginated.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {/* Prev */}
          <button
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goTo(page)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition ${
                page === currentPage
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600"
              }`}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Page info */}
      {totalPages > 1 && (
        <p className="mt-3 text-center text-xs text-gray-400">
          Page {currentPage} of {totalPages}
        </p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import BlogCard from "./BlogCard";
import Pagination from "@/components/shared/Pagination";

const POSTS_PER_PAGE = 8;

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
    const el = document.getElementById("recent-posts-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div id="recent-posts-grid">
      {/* Section heading */}
      <div className="mb-6 flex items-center gap-3">
        <span className="h-5 w-1 rounded-full bg-sk-primary" />
        <h2 className="text-lg font-bold uppercase tracking-widest text-sk-text">
          Recent Posts
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {paginated.map((blog) => (
          <BlogCard key={blog._id || blog.id} blog={blog} />
        ))}
      </div>

      {/* Responsive Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goTo}
        className="mt-10"
      />
    </div>
  );
}

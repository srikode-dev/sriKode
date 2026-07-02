"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Calendar, Clock, ArrowRight } from "lucide-react";
import { blogs } from "@/data/dummy-blog-data";
import Container from "@/components/shared/Container";
import Sidebar from "@/components/home/sidebar/Sidebar";

// Derive unique categories from data
const ALL_CATEGORIES = ["All", ...Array.from(new Set(blogs.map((b) => b.category)))];

const POSTS_PER_PAGE = 6;

function BlogListCard({ blog }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:flex-row">
      {/* Thumbnail */}
      <Link
        href={`/blog/${blog.slug}`}
        className="relative block h-52 w-full flex-shrink-0 overflow-hidden sm:h-auto sm:w-48"
      >
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 192px"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
            {blog.category}
          </span>
          <Link href={`/blog/${blog.slug}`}>
            <h2 className="mt-2 line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-blue-600">
              {blog.title}
            </h2>
          </Link>
          <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">{blog.excerpt}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {blog.publishedAt}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {blog.readingTime}
            </span>
          </div>
          <Link
            href={`/blog/${blog.slug}`}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:gap-2"
          >
            Read More <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function BlogsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const matchCat = activeCategory === "All" || b.category === activeCategory;
      const matchSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  return (
    <div className="py-10">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
            SriKode Blog
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
            All Tutorials & Articles
          </h1>
          <p className="mt-2 text-gray-500">
            Practical, step-by-step web development tutorials for all levels.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 max-w-xl">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="blog-search"
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search tutorials..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-10 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          {search && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main layout — posts + sidebar */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
          {/* Left — Posts */}
          <div>
            {/* Results count */}
            <p className="mb-5 text-sm text-gray-400">
              {filtered.length} article{filtered.length !== 1 ? "s" : ""} found
              {search && <span> for &quot;{search}&quot;</span>}
            </p>

            {paginated.length > 0 ? (
              <div className="flex flex-col gap-5">
                {paginated.map((blog) => (
                  <BlogListCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-20 text-center">
                <span className="text-4xl">🔍</span>
                <p className="mt-4 text-base font-semibold text-gray-700">No results found</p>
                <p className="mt-1 text-sm text-gray-400">
                  Try a different search term or category.
                </p>
                <button
                  onClick={() => { handleSearch(""); handleCategoryChange("All"); }}
                  className="mt-5 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition ${
                      page === currentPage
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600"
                    }`}
                    aria-current={page === currentPage ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Sticky Sidebar */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <Sidebar blogs={blogs} />
          </div>
        </div>
      </Container>
    </div>
  );
}

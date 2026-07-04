"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Calendar, Clock, ArrowRight, Grid, List } from "lucide-react";
import { blogs } from "@/data/dummy-blog-data";
import Container from "@/components/shared/Container";
import Sidebar from "@/components/home/sidebar/Sidebar";
import BlogCard from "@/components/home/blog/BlogCard";

// Derive unique categories from data
const ALL_CATEGORIES = ["All", ...Array.from(new Set(blogs.map((b) => b.category)))];

const POSTS_PER_PAGE = 8;

function BlogListCard({ blog }) {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:flex-row"
      style={{
        backgroundColor: "var(--sk-bg-card)",
        border: "1px solid var(--sk-border)",
      }}
    >
      {/* Thumbnail */}
      <Link
        href={`/blog/${blog.slug}`}
        className="relative block h-52 w-full shrink-0 overflow-hidden sm:h-auto sm:w-48"
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
          <span
            className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
            style={{
              backgroundColor: "var(--sk-primary-light)",
              color: "var(--sk-primary-text)",
            }}
          >
            {blog.category}
          </span>
          <Link href={`/blog/${blog.slug}`}>
            <h2
              className="mt-2 line-clamp-2 text-base font-bold transition-colors"
              style={{ color: "var(--sk-text)" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--sk-primary)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--sk-text)"}
            >
              {blog.title}
            </h2>
          </Link>
          <p className="mt-1.5 line-clamp-2 text-sm" style={{ color: "var(--sk-text-muted)" }}>
            {blog.excerpt}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--sk-text-faint)" }}>
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
            className="flex items-center gap-1 text-xs font-semibold transition hover:gap-2"
            style={{ color: "var(--sk-primary)" }}
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
  const [viewMode, setViewMode] = useState("grid");

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
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--sk-primary)" }}
          >
            SriKode Blog
          </p>
          <h1
            className="text-3xl font-extrabold md:text-4xl"
            style={{ color: "var(--sk-text)" }}
          >
            All Tutorials &amp; Articles
          </h1>
          <p className="mt-2" style={{ color: "var(--sk-text-muted)" }}>
            Practical, step-by-step web development tutorials for all levels.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 max-w-xl">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--sk-text-faint)" }} />
          <input
            id="blog-search"
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search tutorials..."
            className="w-full rounded-xl py-3 pl-11 pr-10 text-sm outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--sk-bg-card)",
              border: "1px solid var(--sk-border-strong)",
              color: "var(--sk-text)",
            }}
          />
          {search && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--sk-text-faint)" }}
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
              className="rounded-full px-4 py-1.5 text-xs font-semibold border transition active:scale-[0.98]"
              style={{
                backgroundColor: activeCategory === cat ? "var(--sk-primary)" : "var(--sk-bg-card)",
                borderColor: activeCategory === cat ? "var(--sk-primary)" : "var(--sk-border-strong)",
                color: activeCategory === cat ? "#ffffff" : "var(--sk-text-muted)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main layout — posts + sidebar */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
          {/* Left — Posts */}
          <div>
            {/* Results count & view toggle */}
            <div className="mb-6 flex items-center justify-between border-b border-gray-150/40 pb-4 dark:border-zinc-800/40">
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                {filtered.length} article{filtered.length !== 1 ? "s" : ""} found
                {search && <span> for &quot;{search}&quot;</span>}
              </p>
              
              {/* Grid / List Switcher */}
              <div
                className="flex items-center gap-1 rounded-lg border p-0.5 shadow-xs"
                style={{
                  backgroundColor: "var(--sk-bg-card)",
                  borderColor: "var(--sk-border)",
                }}
              >
                <button
                  onClick={() => setViewMode("grid")}
                  className="rounded-md p-1.5 transition"
                  style={{
                    backgroundColor: viewMode === "grid" ? "var(--sk-primary-light)" : "transparent",
                    color: viewMode === "grid" ? "var(--sk-primary-text)" : "var(--sk-text-faint)",
                  }}
                  aria-label="Grid view"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className="rounded-md p-1.5 transition"
                  style={{
                    backgroundColor: viewMode === "list" ? "var(--sk-primary-light)" : "transparent",
                    color: viewMode === "list" ? "var(--sk-primary-text)" : "var(--sk-text-faint)",
                  }}
                  aria-label="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            {paginated.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {paginated.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {paginated.map((blog) => (
                    <BlogListCard key={blog.id} blog={blog} />
                  ))}
                </div>
              )
            ) : (
              <div
                className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center"
                style={{ borderColor: "var(--sk-border)" }}
              >
                <span className="text-4xl">🔍</span>
                <p className="mt-4 text-base font-semibold" style={{ color: "var(--sk-text)" }}>No results found</p>
                <p className="mt-1 text-sm" style={{ color: "var(--sk-text-faint)" }}>
                  Try a different search term or category.
                </p>
                <button
                  onClick={() => { handleSearch(""); handleCategoryChange("All"); }}
                  className="mt-5 rounded-full px-5 py-2 text-sm font-semibold text-white transition active:scale-[0.98]"
                  style={{ backgroundColor: "var(--sk-primary)" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--sk-primary-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--sk-primary)"}
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors duration-200 active:scale-95"
                    style={{
                      backgroundColor: page === currentPage ? "var(--sk-primary)" : "var(--sk-bg-card)",
                      borderColor: page === currentPage ? "var(--sk-primary)" : "var(--sk-border-strong)",
                      color: page === currentPage ? "#ffffff" : "var(--sk-text-muted)",
                    }}
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

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { getBlogs, getCmsConfig } from "@/lib/api";
import { formatDate } from "@/data";
import Container from "@/components/shared/Container";
import Sidebar from "@/components/home/sidebar/Sidebar";
import BlogCard from "@/components/home/blog/BlogCard";
import AdBanner from "@/components/shared/AdBanner";
import Pagination from "@/components/shared/Pagination";

const POSTS_PER_PAGE = 12;

function BlogListCard({ blog }) {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-xl shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:flex-row"
      style={{
        backgroundColor: "var(--sk-bg-card)",
        border: "1px solid var(--sk-border)",
      }}
    >
      {/* Thumbnail */}
      <Link
        href={`/blog/${blog.slug}`}
        className="relative block h-52 w-full shrink-0 overflow-hidden sm:h-auto sm:w-52"
      >
        <Image
          src={blog.coverImage || "/placeholder-banner.webp"}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 208px"
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
            <h2 className="mt-2 line-clamp-2 text-base font-bold text-sk-text hover:text-sk-primary transition-colors">
              {blog.title}
            </h2>
          </Link>
          <p className="mt-1.5 line-clamp-2 text-sm" style={{ color: "var(--sk-text-muted)" }}>
            {blog.excerpt}
          </p>
        </div>

        {/* Bottom meta - clean typography without bottom icons */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--sk-text-faint)" }}>
            <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
            {blog.readingTime && (
              <>
                <span>•</span>
                <span>{blog.readingTime}</span>
              </>
            )}
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
  const [blogs, setBlogs] = useState([]);
  const [cmsConfig, setCmsConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const catScrollRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const [res, cms] = await Promise.allSettled([
          getBlogs({ limit: 100 }),
          getCmsConfig(),
        ]);
        if (res.status === "fulfilled") setBlogs(res.value?.blogs || []);
        if (cms.status === "fulfilled") setCmsConfig(cms.value);
      } catch (error) {
        console.error("Failed to load blogs on client list page:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const headerSponsor = useMemo(() => {
    const sponsors = cmsConfig?.sponsors || [];
    const s = sponsors.find((sp) => sp.isActive && (sp.slot === "header" || sp.slot === "all"));
    return s ? {
      title: s.title,
      desc: s.description,
      badge: s.badge,
      cta: s.ctaText,
      link: s.targetUrl,
    } : null;
  }, [cmsConfig]);

  // Count blogs per category
  const categoryCounts = useMemo(() => {
    const map = { All: blogs.length };
    blogs.forEach((b) => {
      if (b.category) {
        map[b.category] = (map[b.category] || 0) + 1;
      }
    });
    return map;
  }, [blogs]);

  // Order categories: "All" first, then popular categories descending by count
  const sortedCategories = useMemo(() => {
    const distinct = Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)));
    distinct.sort((a, b) => (categoryCounts[b] || 0) - (categoryCounts[a] || 0));
    return ["All", ...distinct];
  }, [blogs, categoryCounts]);

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const matchCat = activeCategory === "All" || b.category === activeCategory;
      const matchSearch =
        !search ||
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [blogs, search, activeCategory]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filtered.slice(start, start + POSTS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const el = document.getElementById("blogs-catalog-start");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollCategories = (direction) => {
    if (!catScrollRef.current) return;
    const offset = direction === "left" ? -220 : 220;
    catScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className="pt-5 pb-16">
      <Container>
        {/* Page Header with Top-Right Banner to eliminate empty space */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px] lg:items-center">
          <div>
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
            <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--sk-text-muted)" }}>
              Practical, step-by-step web development tutorials for modern developers.
            </p>

            {/* Search Bar */}
            <div className="relative mt-4 w-full max-w-xl">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: "var(--sk-text-faint)" }}
              />
              <input
                id="blog-search"
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search tutorials by title, topic, or keyword..."
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: "var(--sk-text-faint)" }}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Top-Right Ad Banner / Featured Sponsor slot - fixes top-right empty space */}
          <div className="hidden lg:block">
            <AdBanner slot="header" customSponsor={headerSponsor} />
          </div>
        </div>

        {/* Category Filter Tabs - Responsive Carousel with Chevron Controls & Direct Selector */}
        <div className="mb-8 flex items-center gap-2">
          {/* Scroll Left Button */}
          <button
            onClick={() => scrollCategories("left")}
            className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-2xs transition hover:border-sk-primary hover:text-sk-primary active:scale-95 cursor-pointer"
            style={{
              backgroundColor: "var(--sk-bg-card)",
              borderColor: "var(--sk-border)",
              color: "var(--sk-text-muted)",
            }}
            aria-label="Scroll categories left"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Horizontally Scrollable Pills Track */}
          <div
            ref={catScrollRef}
            className="flex-1 flex items-center gap-2 overflow-x-auto py-1 scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {sortedCategories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition active:scale-[0.98] cursor-pointer whitespace-nowrap"
                  style={{
                    backgroundColor: isActive ? "var(--sk-primary)" : "var(--sk-bg-card)",
                    borderColor: isActive ? "var(--sk-primary)" : "var(--sk-border-strong)",
                    color: isActive ? "#ffffff" : "var(--sk-text-muted)",
                  }}
                >
                  <span>{cat}</span>
                  <span
                    className="rounded-full px-1.5 py-0.2 text-[10px] font-bold"
                    style={{
                      backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "var(--sk-primary-light)",
                      color: isActive ? "#ffffff" : "var(--sk-primary-text)",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => scrollCategories("right")}
            className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-2xs transition hover:border-sk-primary hover:text-sk-primary active:scale-95 cursor-pointer"
            style={{
              backgroundColor: "var(--sk-bg-card)",
              borderColor: "var(--sk-border)",
              color: "var(--sk-text-muted)",
            }}
            aria-label="Scroll categories right"
          >
            <ChevronRight size={16} />
          </button>

          {/* Direct Category Dropdown for quick access when categories grow */}
          {sortedCategories.length > 5 && (
            <div className="relative shrink-0 sm:ml-2">
              <label htmlFor="category-select" className="sr-only">Jump to category</label>
              <select
                id="category-select"
                value={activeCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="rounded-xl border px-3 py-1.5 text-xs font-semibold outline-none transition cursor-pointer"
                style={{
                  backgroundColor: "var(--sk-bg-card)",
                  borderColor: "var(--sk-border-strong)",
                  color: "var(--sk-text)",
                }}
              >
                {sortedCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} ({categoryCounts[cat] || 0})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Main layout — posts + sidebar */}
        <div id="blogs-catalog-start" className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
          {/* Left — Posts */}
          <div>
            {/* Results count & view toggle */}
            <div className="mb-6 flex items-center justify-between border-b border-sk-border pb-4">
              <p className="text-sm" style={{ color: "var(--sk-text-muted)" }}>
                Showing{" "}
                <strong style={{ color: "var(--sk-text)" }}>
                  {filtered.length > 0 ? (currentPage - 1) * POSTS_PER_PAGE + 1 : 0}
                  –
                  {Math.min(currentPage * POSTS_PER_PAGE, filtered.length)}
                </strong>{" "}
                of <strong style={{ color: "var(--sk-text)" }}>{filtered.length}</strong> article{filtered.length !== 1 ? "s" : ""}
                {search && <span> for &quot;{search}&quot;</span>}
                {activeCategory !== "All" && <span> in {activeCategory}</span>}
              </p>
              
              {/* Grid / List Switcher */}
              <div
                className="flex items-center gap-1 rounded-lg border p-0.5 shadow-2xs"
                style={{
                  backgroundColor: "var(--sk-bg-card)",
                  borderColor: "var(--sk-border)",
                }}
              >
                <button
                  onClick={() => setViewMode("grid")}
                  className="rounded-md p-1.5 transition cursor-pointer"
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
                  className="rounded-md p-1.5 transition cursor-pointer"
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

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4" style={{ borderTopColor: "var(--sk-primary)", borderLeftColor: "var(--sk-border)", borderRightColor: "var(--sk-border)", borderBottomColor: "var(--sk-border)" }} />
              </div>
            ) : paginatedPosts.length > 0 ? (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {paginatedPosts.map((blog) => (
                      <BlogCard key={blog._id || blog.id} blog={blog} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {paginatedPosts.map((blog) => (
                      <BlogListCard key={blog._id || blog.id} blog={blog} />
                    ))}
                  </div>
                )}

                {/* Scalable Numbered Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="mt-12"
                />
              </>
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
                  className="mt-5 rounded-full px-5 py-2 text-sm font-semibold text-white transition active:scale-[0.98] cursor-pointer"
                  style={{ backgroundColor: "var(--sk-primary)" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--sk-primary-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--sk-primary)"}
                >
                  Clear Filters
                </button>
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

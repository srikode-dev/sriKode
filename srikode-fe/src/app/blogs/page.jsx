"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Calendar, Clock, ArrowRight, Grid, List, FileText, Loader2, Sparkles } from "lucide-react";
import { getBlogs } from "@/lib/api";
import { formatDate } from "@/data";
import Container from "@/components/shared/Container";
import Sidebar from "@/components/home/sidebar/Sidebar";
import BlogCard from "@/components/home/blog/BlogCard";

const BATCH_SIZE = 12;

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

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--sk-text-faint)" }}>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(blog.publishedAt || blog.createdAt)}
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
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  
  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getBlogs({ limit: 100 });
        setBlogs(res.blogs || []);
      } catch (error) {
        console.error("Failed to load blogs on client list page:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const ALL_CATEGORIES = useMemo(() => {
    return ["All", ...Array.from(new Set(blogs.map((b) => b.category)))];
  }, [blogs]);

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

  const visiblePosts = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const hasMore = visibleCount < filtered.length;

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setVisibleCount(BATCH_SIZE);
  };

  const handleSearch = (val) => {
    setSearch(val);
    setVisibleCount(BATCH_SIZE);
  };

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filtered.length));
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, hasMore, filtered.length]);

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "300px" }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, loading, loadMore]);

  return (
    <div className="pt-5 pb-16">
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
          <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--sk-text-muted)" }}>
            Practical, step-by-step web development tutorials for modern developers.
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
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
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
              className="rounded-full px-4 py-1.5 text-xs font-semibold border transition active:scale-[0.98] cursor-pointer"
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
                Showing <strong className="text-sk-text">{visiblePosts.length}</strong> of <strong className="text-sk-text">{filtered.length}</strong> article{filtered.length !== 1 ? "s" : ""}
                {search && <span> for &quot;{search}&quot;</span>}
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
            ) : visiblePosts.length > 0 ? (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {visiblePosts.map((blog) => (
                      <BlogCard key={blog._id || blog.id} blog={blog} />
                    ))}
                    {/* Fill empty grid space if odd number of items */}
                    {visiblePosts.length % 2 !== 0 && !hasMore && (
                      <div 
                        className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center shadow-xs" 
                        style={{ borderColor: 'var(--sk-border-strong)', backgroundColor: 'var(--sk-bg-subtle)' }}
                      >
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50/50 text-blue-600 dark:bg-blue-900/10 dark:text-blue-400">
                          <FileText size={28} />
                        </div>
                        <h3 className="mb-2 text-xl font-bold" style={{ color: 'var(--sk-text)' }}>More Content Incoming!</h3>
                        <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--sk-text-muted)' }}>
                          We are actively drafting more practical tutorials. Check back soon or subscribe to our newsletter!
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {visiblePosts.map((blog) => (
                      <BlogListCard key={blog._id || blog.id} blog={blog} />
                    ))}
                  </div>
                )}

                {/* Infinite Scroll Sentinel & Loading Indicator */}
                {hasMore && (
                  <div ref={sentinelRef} className="mt-12 flex flex-col items-center justify-center py-6 text-center">
                    {isLoadingMore ? (
                      <div className="flex items-center gap-2 text-xs font-bold text-sk-primary">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading next batch of articles...</span>
                      </div>
                    ) : (
                      <button
                        onClick={loadMore}
                        className="inline-flex items-center gap-2 rounded-xl border border-sk-border bg-sk-bg-card px-6 py-3 text-xs font-bold text-sk-text shadow-2xs hover:bg-sk-bg-subtle transition active:scale-[0.98] cursor-pointer"
                      >
                        <span>Load More Articles</span>
                        <span className="rounded-full bg-sk-primary-light px-2 py-0.5 text-[10px] text-sk-primary-text">
                          +{Math.min(BATCH_SIZE, filtered.length - visibleCount)}
                        </span>
                      </button>
                    )}
                  </div>
                )}

                {/* End of list banner */}
                {!hasMore && filtered.length > 0 && (
                  <div className="mt-12 rounded-2xl border border-dashed border-sk-border bg-sk-bg-card p-6 text-center shadow-2xs">
                    <span className="inline-block p-2 rounded-xl bg-sk-primary-light text-sk-primary mb-2">
                      <Sparkles size={18} />
                    </span>
                    <p className="text-xs font-bold text-sk-text">You've reached the end of the catalog</p>
                    <p className="text-[11px] text-sk-text-muted mt-0.5">
                      Showing all {filtered.length} tutorials in {activeCategory === "All" ? "all categories" : activeCategory}.
                    </p>
                  </div>
                )}
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

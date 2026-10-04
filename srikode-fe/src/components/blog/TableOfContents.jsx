"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";
import { useLenis } from "@/components/shared/SmoothScrollProvider";

export default function TableOfContents({ items = [] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navRef = useRef(null);
  const lenis = useLenis();

  // Track which heading is currently in viewport
  useEffect(() => {
    if (!items || items.length === 0) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  // Auto-scroll the active TOC link into view inside the nav container
  useEffect(() => {
    if (!navRef.current || !active) return;
    const activeEl = navRef.current.querySelector(`[data-toc-id="${active}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [active]);

  // Smooth scroll to heading using Lenis (or native fallback)
  const handleClick = useCallback(
    (e, id) => {
      e.preventDefault();
      const target = document.getElementById(id);
      if (!target) return;

      if (lenis) {
        lenis.scrollTo(target, { offset: -80, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [lenis]
  );

  if (!items || items.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-sk-border bg-sk-bg-card shadow-xs transition-all duration-300">
      {/* TOC Header with Collapse Toggle */}
      <div className="flex items-center justify-between border-b border-sk-border px-4 py-3 select-none">
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex flex-1 items-center justify-between gap-2 text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sk-primary-light text-sk-primary">
              <List size={13} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-sk-text">
              Table of Contents
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-sk-bg-subtle px-2 py-0.5 text-[10px] font-bold text-sk-text-muted">
              {items.length}
            </span>
            {isCollapsed ? (
              <ChevronDown size={15} className="text-sk-text-muted" />
            ) : (
              <ChevronUp size={15} className="text-sk-text-muted" />
            )}
          </div>
        </button>
      </div>

      {/* Scrollable Nav List — isolated scroll via overscroll-contain */}
      {!isCollapsed && (
        <div className="p-3">
          <nav
            ref={navRef}
            className="space-y-1 pr-1"
            style={{
              maxHeight: "calc(60vh - 80px)",
              overflowY: "auto",
              overscrollBehavior: "contain",
              scrollbarWidth: "thin",
              scrollbarColor: "var(--sk-border-strong) transparent",
            }}
          >
            {items.map((item) => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  data-toc-id={item.id}
                  onClick={(e) => handleClick(e, item.id)}
                  className={`group flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-all duration-200 ${
                    isActive
                      ? "bg-sk-primary-light font-bold text-sk-primary-text shadow-2xs"
                      : "text-sk-text-muted hover:bg-sk-bg-subtle hover:text-sk-text"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all ${
                      isActive
                        ? "bg-sk-primary scale-125"
                        : "bg-sk-border group-hover:bg-sk-text-faint"
                    }`}
                  />
                  <span className="line-clamp-2 leading-snug">{item.title}</span>
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}


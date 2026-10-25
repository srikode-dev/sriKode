"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Universal Responsive Pagination Component
 * 
 * Implements smart windowing with ellipsis so that regardless of whether
 * there are 5, 50, or 500 pages, it never overflows or wraps awkwardly.
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1) return null;

  // Generate pagination items with smart ellipsis windowing
  const getPageNumbers = () => {
    // If 7 or fewer pages, show all: [1, 2, 3, 4, 5, 6, 7]
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Near start: [1, 2, 3, 4, 5, '...', totalPages]
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    // Near end: [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // In middle: [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pages = getPageNumbers();

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={`flex flex-col items-center gap-3 select-none ${className}`}
    >
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Previous page button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-200 hover:border-sk-primary hover:text-sk-primary active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-sk-border-strong disabled:hover:text-sk-text-muted cursor-pointer"
          style={{
            backgroundColor: "var(--sk-bg-card)",
            borderColor: "var(--sk-border-strong)",
            color: "var(--sk-text)",
          }}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers and ellipsis */}
        {pages.map((item, idx) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-9 w-6 sm:w-8 items-center justify-center text-xs font-bold tracking-widest"
                style={{ color: "var(--sk-text-faint)" }}
                aria-hidden="true"
              >
                •••
              </span>
            );
          }

          const pageNum = Number(item);
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className="flex h-9 min-w-9 px-2.5 items-center justify-center rounded-lg border text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: isActive ? "var(--sk-primary)" : "var(--sk-bg-card)",
                borderColor: isActive ? "var(--sk-primary)" : "var(--sk-border-strong)",
                color: isActive ? "#ffffff" : "var(--sk-text)",
              }}
              aria-label={`Page ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next page button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-all duration-200 hover:border-sk-primary hover:text-sk-primary active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-sk-border-strong disabled:hover:text-sk-text-muted cursor-pointer"
          style={{
            backgroundColor: "var(--sk-bg-card)",
            borderColor: "var(--sk-border-strong)",
            color: "var(--sk-text)",
          }}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <p className="text-xs font-medium" style={{ color: "var(--sk-text-faint)" }}>
        Page <strong style={{ color: "var(--sk-text)" }}>{currentPage}</strong> of <strong style={{ color: "var(--sk-text)" }}>{totalPages}</strong>
      </p>
    </nav>
  );
}

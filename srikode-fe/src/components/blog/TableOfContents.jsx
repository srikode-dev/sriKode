"use client";

import { useState, useEffect } from "react";
import { List } from "lucide-react";

export default function TableOfContents({ items }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items.map((item) => document.getElementById(item.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="overflow-hidden rounded-xl border border-sk-border bg-sk-bg-card shadow-sm transition-all duration-300">
      <div className="flex items-center gap-3 border-b border-sk-border px-4 py-3">
        <List size={14} className="text-sk-primary" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-sk-text">
          Table of Contents
        </h3>
      </div>
      <nav className="p-4">
        <ol className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                  active === item.id
                    ? "font-semibold bg-sk-primary-light text-sk-primary-text"
                    : "text-sk-text-muted hover:bg-sk-primary-light/50 hover:text-sk-primary"
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

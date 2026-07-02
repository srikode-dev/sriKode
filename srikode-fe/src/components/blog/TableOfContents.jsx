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
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <List size={14} className="text-blue-600" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800">
          Table of Contents
        </h3>
      </div>
      <nav className="p-4">
        <ol className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block rounded-lg px-3 py-2 text-sm transition ${
                  active === item.id
                    ? "bg-blue-50 font-semibold text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
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

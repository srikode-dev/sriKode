"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";

export default function BlogFaq({ items = [] }) {
  const [openIndices, setOpenIndices] = useState([0]); // Open first FAQ by default

  if (!items || items.length === 0) return null;

  const toggleItem = (index) => {
    setOpenIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // Structured Data for Google FAQPage Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return (
    <section className="mt-12 border-t border-sk-border pt-10">
      {/* Schema.org FAQPage for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sk-primary-light text-sk-primary">
            <HelpCircle size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-sk-text">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-sk-text-muted mt-0.5">
              Quick answers to common questions about this tutorial
            </p>
          </div>
        </div>
        <span className="rounded-full bg-sk-bg-subtle border border-sk-border px-3 py-1 text-xs font-bold text-sk-text-muted">
          {items.length} {items.length === 1 ? "Q&A" : "Q&As"}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const isOpen = openIndices.includes(index);
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${
                isOpen
                  ? "border-sk-primary/40 bg-sk-bg-card shadow-xs"
                  : "border-sk-border bg-sk-bg-subtle/50 hover:bg-sk-bg-card hover:border-sk-border-strong"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-sk-text transition-colors select-none cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-base flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sk-primary/10 text-xs font-bold text-sk-primary">
                    {index + 1}
                  </span>
                  <span>{item.question}</span>
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-sk-text-muted transition-transform duration-300 ease-out ${
                    isOpen ? "rotate-180 text-sk-primary" : ""
                  }`}
                />
              </button>

              {/* Smooth height animation: grid row 0fr -> 1fr, answer stays in the DOM (good for SEO too) */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
                aria-hidden={!isOpen}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-sk-border/60 px-5 pt-3 pb-5 text-sm leading-relaxed text-sk-text-muted">
                    <p className="whitespace-pre-line pl-8">{item.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

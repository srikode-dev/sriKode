"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Zap, Sparkles } from "lucide-react";

/**
 * AdBanner Component
 * 
 * Slots supported:
 * - "in-article": Horizontal responsive banner inside the reading content
 * - "sidebar": 300x250 square / vertical banner in the sticky sidebar
 * - "pre-comments": Wide leaderboard banner before comments & related posts
 */
export default function AdBanner({
  slot = "in-article",
  adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
  adSlot,
  className = "",
  // Optional custom sponsor data
  customSponsor = null,
}) {
  const adRef = useRef(null);

  // If using Google AdSense, automatically initialize the ad push
  useEffect(() => {
    if (adClient && adSlot && typeof window !== "undefined") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.warn("AdSense push error:", err);
      }
    }
  }, [adClient, adSlot]);

  // Sidebar compact ad slot (300x250)
  if (slot === "sidebar") {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-dashed border-sk-border bg-sk-bg-card p-5 shadow-xs text-center ${className}`}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-widest text-sk-text-faint uppercase">
            Sponsor
          </span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
            <Zap size={11} />
          </span>
        </div>

        {adClient && adSlot ? (
          <div ref={adRef} className="min-h-[250px] w-full flex items-center justify-center">
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client={adClient}
              data-ad-slot={adSlot}
              data-ad-format="rectangle"
              data-full-width-responsive="true"
            />
          </div>
        ) : (
          <div className="py-4 space-y-3">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-sk-text">
                {customSponsor?.title || "Supercharge Your Dev Stack"}
              </h4>
              <p className="mt-1 text-xs text-sk-text-muted leading-relaxed">
                {customSponsor?.desc || "High-performance React & Next.js starter templates built for production."}
              </p>
            </div>
            <a
              href={customSponsor?.link || "https://srikode.dev"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-sk-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-sk-primary-hover transition active:scale-[0.98]"
            >
              <span>{customSponsor?.cta || "Explore SriKode Pro"}</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
        )}
      </div>
    );
  }

  // Horizontal wide banners ("in-article" or "pre-comments")
  return (
    <div className={`my-8 overflow-hidden rounded-2xl border border-dashed border-sk-border bg-linear-to-r from-sk-bg-subtle/70 via-sk-bg-card to-sk-bg-subtle/70 p-5 sm:p-6 shadow-xs ${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest text-sk-text-faint uppercase">
          Advertisement
        </span>
        <span className="text-[10px] text-sk-text-faint">
          Support SriKode
        </span>
      </div>

      {adClient && adSlot ? (
        <div ref={adRef} className="min-h-[90px] w-full flex items-center justify-center">
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sk-primary-light text-sk-primary border border-sk-primary/20">
              <Zap size={22} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-sk-text">
                {customSponsor?.title || "SriKode Developer Hub • Master Modern Web Tech"}
              </p>
              <p className="text-xs text-sk-text-muted mt-0.5">
                {customSponsor?.desc || "Explore source code, full-stack video guides, and production architecture."}
              </p>
            </div>
          </div>

          <a
            href={customSponsor?.link || "/blogs"}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-sk-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-sk-primary-hover transition active:scale-[0.98]"
          >
            <span>{customSponsor?.cta || "Browse Free Code"}</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      )}
    </div>
  );
}

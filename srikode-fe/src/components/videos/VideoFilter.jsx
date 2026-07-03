"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Clock, Eye } from "lucide-react";

function VideoCard({ video }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-sk-border bg-sk-bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sk-primary text-white shadow-lg">
            <Play size={22} fill="white" />
          </div>
        </div>
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white">
          {video.duration}
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-sk-primary px-3 py-1 text-[10px] font-semibold uppercase text-white shadow">
          {video.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-sk-text transition-colors group-hover:text-sk-primary">
          {video.title}
        </h3>
        <div className="mt-3 flex items-center gap-3 text-xs text-sk-text-faint">
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {video.views} views
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {video.duration}
          </span>
        </div>
      </div>
    </a>
  );
}

export default function VideoFilter({ videos }) {
  const categories = ["All", ...Array.from(new Set(videos.map((v) => v.category)))];
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? videos : videos.filter((v) => v.category === active);

  return (
    <>
      {/* Category tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="rounded-full px-4 py-1.5 text-xs font-semibold border transition active:scale-[0.98]"
            style={{
              backgroundColor: active === cat ? "var(--sk-primary)" : "var(--sk-bg-card)",
              borderColor: active === cat ? "var(--sk-primary)" : "var(--sk-border-strong)",
              color: active === cat ? "#ffffff" : "var(--sk-text-muted)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-sk-text-faint">
        Showing {filtered.length} of {videos.length} videos
      </p>
    </>
  );
}

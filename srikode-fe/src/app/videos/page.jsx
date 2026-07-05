import Link from "next/link";
import { FaYoutube } from "react-icons/fa";
import Container from "@/components/shared/Container";
import VideoFilter from "@/components/videos/VideoFilter";

export const metadata = {
  title: "Videos",
  description: "Watch free web development video tutorials by Srikant Sahu — HTML, CSS, JavaScript, React, Next.js and more.",
  alternates: {
    canonical: "/videos",
  },
};

import { getVideos } from "@/lib/api";

// Enable dynamic revalidation for YouTube feeds updates
export const revalidate = 300; // 5 minutes

export default async function VideosPage() {
  let dbVideos = [];
  try {
    const res = await getVideos();
    dbVideos = res.videos || [];
  } catch (error) {
    console.error("Failed to load videos in Next.js SSR page: ", error);
  }

  const totalViews = dbVideos.reduce((acc, v) => {
    const viewsStr = String(v.viewCount || "0").replace(/K/gi, "").replace(/M/gi, "");
    const multiplier = String(v.viewCount || "0").toLowerCase().includes("k") ? 1000 : 
                       String(v.viewCount || "0").toLowerCase().includes("m") ? 1000000 : 1;
    const n = parseFloat(viewsStr) * multiplier;
    return acc + (isNaN(n) ? 0 : n);
  }, 0);

  const formattedViews = totalViews >= 1000000 
    ? `${(totalViews / 1000000).toFixed(1)}M+` 
    : totalViews >= 1000 
      ? `${Math.round(totalViews / 1000)}K+` 
      : `${totalViews}+`;

  return (
    <div className="py-10">
      <Container>
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--sk-primary)" }}>YouTube</p>
            <h1 className="text-3xl font-extrabold md:text-4xl" style={{ color: "var(--sk-text)" }}>Video Tutorials</h1>
            <p className="mt-2" style={{ color: "var(--sk-text-muted)" }}>
              Free web development videos — watch, learn and build real projects.
            </p>
          </div>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-650"
          >
            <FaYoutube size={16} />
            Subscribe on YouTube
          </a>
        </div>

        {/* Channel stats strip */}
        <div className="mb-10 grid grid-cols-3 divide-x divide-sk-border overflow-hidden rounded-xl border border-sk-border bg-sk-bg-card shadow-sm">
          {[
            { label: "Total Videos", value: `${dbVideos.length}+` },
            { label: "Total Views", value: formattedViews },
            { label: "Subscribers", value: "1K+" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center py-5">
              <span className="text-2xl font-extrabold" style={{ color: "var(--sk-text)" }}>{value}</span>
              <span className="text-xs" style={{ color: "var(--sk-text-faint)" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Client-side filter + grid */}
        <VideoFilter videos={dbVideos} />
      </Container>
    </div>
  );
}

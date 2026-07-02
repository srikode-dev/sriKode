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

// Static video data — will be replaced by API in Phase 5
export const videos = [
  { id: "v1", title: "Build a Responsive Navigation Bar in HTML CSS & JavaScript", thumbnail: "https://picsum.photos/seed/vid1/640/360", duration: "12:34", views: "24K", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "HTML & CSS" },
  { id: "v2", title: "Create a Beautiful Login Form with HTML CSS & JavaScript", thumbnail: "https://picsum.photos/seed/vid2/640/360", duration: "18:20", views: "18K", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "JavaScript" },
  { id: "v3", title: "Build a Full Stack Todo App with React & Node.js", thumbnail: "https://picsum.photos/seed/vid3/640/360", duration: "42:10", views: "31K", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "React" },
  { id: "v4", title: "Next.js 15 Full Course — App Router, Server Actions & More", thumbnail: "https://picsum.photos/seed/vid4/640/360", duration: "1:12:44", views: "45K", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Next.js" },
  { id: "v5", title: "Complete CSS Flexbox & Grid Tutorial for Beginners", thumbnail: "https://picsum.photos/seed/vid5/640/360", duration: "28:05", views: "22K", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "HTML & CSS" },
  { id: "v6", title: "Build a REST API with Node.js & Express — Full Tutorial", thumbnail: "https://picsum.photos/seed/vid6/640/360", duration: "55:30", views: "37K", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Node.js" },
  { id: "v7", title: "MongoDB & Mongoose Complete Guide 2026", thumbnail: "https://picsum.photos/seed/vid7/640/360", duration: "38:15", views: "19K", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "MongoDB" },
  { id: "v8", title: "Tailwind CSS v4 — Everything You Need to Know", thumbnail: "https://picsum.photos/seed/vid8/640/360", duration: "22:50", views: "29K", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "Tailwind CSS" },
  { id: "v9", title: "React Hooks Deep Dive — useState, useEffect, useRef & More", thumbnail: "https://picsum.photos/seed/vid9/640/360", duration: "46:00", views: "53K", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "React" },
];

export default function VideosPage() {
  const totalViews = videos.reduce((acc, v) => {
    const n = parseFloat(v.views.replace("K", "")) * 1000;
    return acc + n;
  }, 0);

  return (
    <div className="py-10">
      <Container>
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-red-600">YouTube</p>
            <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">Video Tutorials</h1>
            <p className="mt-2 text-gray-500">
              Free web development videos — watch, learn and build real projects.
            </p>
          </div>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-red-700"
          >
            <FaYoutube size={16} />
            Subscribe on YouTube
          </a>
        </div>

        {/* Channel stats strip */}
        <div className="mb-10 grid grid-cols-3 divide-x divide-gray-100 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {[
            { label: "Total Videos", value: `${videos.length}+` },
            { label: "Total Views", value: `${Math.round(totalViews / 1000)}K+` },
            { label: "Subscribers", value: "500+" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center py-5">
              <span className="text-2xl font-extrabold text-gray-900">{value}</span>
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Client-side filter + grid */}
        <VideoFilter videos={videos} />
      </Container>
    </div>
  );
}

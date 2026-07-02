import Link from "next/link";
import Image from "next/image";
import { Play, Clock, Eye } from "lucide-react";
import Container from "@/components/shared/Container";

const videos = [
  {
    id: "v1",
    title: "Build a Responsive Navigation Bar in HTML CSS & JavaScript",
    thumbnail: "https://picsum.photos/seed/vid1/640/360",
    duration: "12:34",
    views: "24K",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "HTML & CSS",
  },
  {
    id: "v2",
    title: "Create a Beautiful Login Form with HTML CSS & JavaScript",
    thumbnail: "https://picsum.photos/seed/vid2/640/360",
    duration: "18:20",
    views: "18K",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "JavaScript",
  },
  {
    id: "v3",
    title: "Build a Full Stack Todo App with React & Node.js",
    thumbnail: "https://picsum.photos/seed/vid3/640/360",
    duration: "42:10",
    views: "31K",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "React",
  },
];

function VideoCard({ video }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
            <Play size={22} fill="white" />
          </div>
        </div>
        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white">
          {video.duration}
        </span>
        {/* Category */}
        <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-[10px] font-semibold uppercase text-white">
          {video.category}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-red-600">
          {video.title}
        </h3>
        <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
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

export default function LatestVideos() {
  return (
    <section className="py-14">
      <Container>
        {/* Heading */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-5 w-1 rounded-full bg-red-600" />
            <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800">
              Latest Videos
            </h2>
          </div>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-red-500 hover:text-red-600"
          >
            <Play size={12} fill="currentColor" />
            View Channel
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import Container from "@/components/shared/Container";
import { blogs, formatDate } from "@/data";

const statsData = [
  { value: 50, label: "Tutorials" },
  { value: 10, suffix: "K+", label: "Readers" },
  { value: 100, label: "Examples" },
  { value: 5, label: "Years Exp" },
];

function CountUp({ value, duration = 1500 }) {
  const [count, setCount] = useState(value);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  return <>{mounted ? count : value}</>;
}

function HeroCard({ blog, type }) {
  const isLarge = type === "large";
  const isMedium = type === "medium";

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group relative block h-full w-full overflow-hidden rounded-2xl bg-slate-950 border-0 dark:shadow-[0_16px_45px_-12px_rgba(0,0,0,0.6)] transition-all duration-500 hover:shadow-[0_22px_55px_-10px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_28px_60px_-10px_rgba(0,0,0,0.85)] hover:-translate-y-0.5"
    >
      {/* Background Image */}
      <Image
        src={blog.coverImage}
        alt={blog.title}
        fill
        priority={isLarge}
        className="object-cover opacity-85 dark:opacity-75 transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-95 dark:group-hover:opacity-85"
        sizes={
          isLarge
            ? "(max-width: 1024px) 100vw, 600px"
            : isMedium
            ? "(max-width: 1024px) 100vw, 600px"
            : "300px"
        }
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

      {/* Content overlay bottom-left */}
      <div className={`absolute bottom-0 left-0 w-full p-4 sm:p-5 text-white flex flex-col justify-end ${isLarge ? "sm:p-8" : ""}`}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[9px] font-black uppercase tracking-wider text-blue-400 dark:text-blue-300">
            {blog.category}
          </span>
          <span className="text-white/40 text-[10px]">•</span>
          <span className="flex items-center gap-1 text-[10px] text-white/60 font-medium">
            <Clock size={10} />
            {blog.readingTime}
          </span>
        </div>

        <h3
          className={`font-black leading-tight text-white transition-colors group-hover:text-blue-300 tracking-tight ${
            isLarge
              ? "text-xl sm:text-2xl lg:text-3xl line-clamp-3"
              : isMedium
              ? "text-base sm:text-lg line-clamp-2"
              : "text-xs sm:text-sm line-clamp-2"
          }`}
        >
          {blog.title}
        </h3>

        <span className="mt-2 text-[9px] text-white/50 dark:text-slate-400 font-medium">
          {formatDate(blog.publishedAt)}
        </span>
      </div>
    </Link>
  );
}

function StatItem({ value, suffix, label, isLast }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-extrabold text-blue-600 dark:text-blue-400 text-base">
        <CountUp value={value} />
        {suffix || "+"}
      </span>
      <span>{label}</span>
      {!isLast && (
        <span className="hidden sm:inline-block ml-8 text-gray-350 dark:text-slate-800">•</span>
      )}
    </div>
  );
}

export default function Hero() {
  const featuredBlog = blogs[0];
  const blog2 = blogs[1];
  const blog3 = blogs[2];
  const blog4 = blogs[3];

  return (
    <section className="pt-6 pb-8">
      <Container>
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 auto-rows-[240px] md:auto-rows-[260px] lg:auto-rows-auto lg:h-[480px]">
          {/* Card 1: Left Large (6 cols wide, 2 rows high) */}
          <div className="md:col-span-2 lg:col-span-6 lg:row-span-2">
            <HeroCard blog={featuredBlog} type="large" />
          </div>

          {/* Card 2: Right Top Medium (2 cols wide on md, 6 cols wide on lg, 1 row high) */}
          <div className="md:col-span-2 lg:col-span-6 lg:row-span-1">
            <HeroCard blog={blog2} type="medium" />
          </div>

          {/* Card 3: Right Bottom Left Small (1 col wide on md, 3 cols wide on lg, 1 row high) */}
          <div className="md:col-span-1 lg:col-span-3 lg:row-span-1">
            <HeroCard blog={blog3} type="small" />
          </div>

          {/* Card 4: Right Bottom Right Small (1 col wide on md, 3 cols wide on lg, 1 row high) */}
          <div className="md:col-span-1 lg:col-span-3 lg:row-span-1">
            <HeroCard blog={blog4} type="small" />
          </div>
        </div>

        {/* Minimalist Centered Inline Stats */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-gray-500 dark:text-slate-400 font-medium select-none">
          {statsData.map((s, idx) => (
            <StatItem
              key={idx}
              {...s}
              isLast={idx === statsData.length - 1}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
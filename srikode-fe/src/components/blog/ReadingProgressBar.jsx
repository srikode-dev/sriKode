"use client";

import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateReadingProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        const progress = Number(
          ((currentScroll / scrollHeight) * 100).toFixed(2)
        );
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener("scroll", updateReadingProgress, { passive: true });
    updateReadingProgress();

    return () => window.removeEventListener("scroll", updateReadingProgress);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] w-full bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-linear-to-r from-blue-600 via-indigo-500 to-sky-400 dark:from-blue-500 dark:via-indigo-400 dark:to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all duration-75 ease-out"
        style={{ width: `${readingProgress}%` }}
      />
    </div>
  );
}

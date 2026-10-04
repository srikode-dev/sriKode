"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLenis } from "@/components/shared/SmoothScrollProvider";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || window.scrollY;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      if (windowHeight > 0) {
        const progress = Math.min(
          100,
          Math.max(0, (totalScroll / windowHeight) * 100)
        );
        setScrollProgress(progress);
      }

      setIsVisible(totalScroll > 320);
    };

    // Listen to both native scroll and Lenis scroll events
    window.addEventListener("scroll", handleScroll, { passive: true });

    if (lenis) {
      lenis.on("scroll", handleScroll);
    }

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (lenis) {
        lenis.off("scroll", handleScroll);
      }
    };
  }, [lenis]);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!isVisible) return null;

  // SVG circular progress calculation (radius = 18, circumference = 2 * PI * 18 ≈ 113.1)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div className="fixed bottom-6 right-6 z-40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title={`Scroll to top (${Math.round(scrollProgress)}% read)`}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-sk-bg-card/90 backdrop-blur-md border border-sk-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-sk-primary"
      >
        {/* Circular Progress Ring */}
        <svg
          className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none"
          viewBox="0 0 44 44"
        >
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-sk-border/40"
            strokeWidth="2.5"
            fill="transparent"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="stroke-sk-primary transition-[stroke-dashoffset] duration-150"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Arrow Icon */}
        <ArrowUp
          size={18}
          className="text-sk-text group-hover:text-sk-primary transition-colors duration-200 group-hover:-translate-y-0.5"
        />
      </button>
    </div>
  );
}


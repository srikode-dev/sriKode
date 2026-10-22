"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { loadingManager } from "@/lib/loadingManager";

export default function GlobalLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const progressTimerRef = useRef(null);
  const completeTimerRef = useRef(null);

  // Trigger brief progress on route changes
  useEffect(() => {
    startProgress();
    const timeout = setTimeout(() => {
      finishProgress();
    }, 400);

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  // Subscribe to API calls via loadingManager
  useEffect(() => {
    const unsubscribe = loadingManager.subscribe((active) => {
      if (active) {
        setIsLoading(true);
        startProgress();
      } else {
        setIsLoading(false);
        finishProgress();
      }
    });

    return () => unsubscribe();
  }, []);

  const startProgress = () => {
    setVisible(true);
    setProgress(15);

    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current);

    // Incrementally simulate progress while waiting
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 50) return prev + Math.random() * 15;
        if (prev < 80) return prev + Math.random() * 6;
        if (prev < 90) return prev + 0.5;
        return prev;
      });
    }, 250);
  };

  const finishProgress = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    setProgress(100);

    completeTimerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setProgress(0), 300);
    }, 350);
  };

  if (!visible && progress === 0) return null;

  return (
    <>
      {/* ── Top Slim Glowing Progress Bar ── */}
      <div
        className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-300"
        style={{
          opacity: visible ? 1 : 0,
          height: "3px",
        }}
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-300 ease-out"
          style={{
            width: `${Math.min(100, Math.max(0, progress))}%`,
            boxShadow: "0 0 12px var(--sk-primary, #2563eb), 0 0 6px #60a5fa",
          }}
        />
      </div>

      {/* ── Subtle Floating Glass Micro-Pill ── */}
      <div
        className={`fixed bottom-6 left-6 z-[99998] pointer-events-none flex items-center gap-2 rounded-full border border-sk-border bg-sk-bg-card/90 px-3.5 py-1.5 shadow-lg backdrop-blur-md transition-all duration-300 ${
          visible && isLoading
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-3 opacity-0 scale-95"
        }`}
        aria-hidden="true"
      >
        <div className="relative flex h-2 w-2 items-center justify-center">
          <span className="absolute h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
          <span className="relative h-2 w-2 rounded-full bg-blue-600" />
        </div>
        <span className="text-[11px] font-bold tracking-wide text-sk-text">
          Loading...
        </span>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import LegalPageSkeleton from "./LegalPageSkeleton";
import { useLenis } from "./SmoothScrollProvider";

export default function LegalPageWrapper({ titleWidth = "w-64", children }) {
  const [loading, setLoading] = useState(true);
  const lenis = useLenis();

  useEffect(() => {
    // Force immediate scroll to top on mount
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }

    // Brief duration so skeleton loader is clearly displayed while page initializes
    const timer = setTimeout(() => {
      setLoading(false);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [lenis]);

  if (loading) {
    return <LegalPageSkeleton titleWidth={titleWidth} />;
  }

  return (
    <div className="transition-opacity duration-300">
      {children}
    </div>
  );
}

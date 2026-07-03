"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 50, suffix: "+", label: "Tutorials Published" },
  { value: 10, suffix: "K+", label: "Monthly Readers" },
  { value: 100, suffix: "+", label: "Code Examples" },
  { value: 5, suffix: "+", label: "Years of Teaching" },
];

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatItem({ value, suffix, label, animate }) {
  const count = useCountUp(value, 1600, animate);
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-4xl font-extrabold text-white md:text-5xl">
        {animate ? count : 0}
        {suffix}
      </span>
      <span className="text-sm font-medium text-blue-100 md:text-base">{label}</span>
    </div>
  );
}

export default function StatsBar() {
  const ref = useRef(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-14"
      style={{ backgroundColor: "var(--sk-primary)" }}
    >
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} animate={animate} />
          ))}
        </div>
      </div>
    </section>
  );
}

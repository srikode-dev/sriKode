"use client";

import { useRef, useState } from "react";

export default function TimelineSection({ timeline }) {
  const scrollRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDown(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX); // Scroll exactly with cursor
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="mb-16">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-5 w-1 rounded-full" style={{ backgroundColor: "var(--sk-primary)" }} />
        <h2 className="text-xl font-bold uppercase tracking-widest" style={{ color: "var(--sk-text)" }}>
          Our Journey
        </h2>
      </div>
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`relative flex flex-col md:flex-row md:overflow-x-auto md:pb-8 md:pt-4 md:gap-0 gap-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none ${isDown ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {timeline.map(({ year, title, desc }, i) => (
          <div 
            key={i} 
            className="relative flex-none w-full md:w-[320px] border-l-2 md:border-l-0 md:border-t-2 pl-8 md:pl-0 pt-0 md:pt-10 pr-0 md:pr-10"
            style={{ borderColor: "var(--sk-border-strong)" }}
          >
            {/* Dot */}
            <span
              className="absolute left-[-11px] md:left-0 top-0 md:top-[-11px] flex h-5 w-5 items-center justify-center rounded-full border-2 text-[8px] font-bold z-10"
              style={{
                borderColor: "var(--sk-primary)",
                backgroundColor: "var(--sk-bg-card)",
                color: "var(--sk-primary)",
              }}
            >
              ●
            </span>
            
            {/* Content */}
            <div className="md:mt-0 -mt-1.5 pb-2 md:pb-0 pointer-events-none">
              <span
                className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold tracking-widest shadow-sm"
                style={{
                  backgroundColor: "var(--sk-primary-light)",
                  color: "var(--sk-primary-text)",
                }}
              >
                {year}
              </span>
              <h3 className="text-lg font-extrabold" style={{ color: "var(--sk-text)" }}>
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed md:pr-4" style={{ color: "var(--sk-text-muted)" }}>
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

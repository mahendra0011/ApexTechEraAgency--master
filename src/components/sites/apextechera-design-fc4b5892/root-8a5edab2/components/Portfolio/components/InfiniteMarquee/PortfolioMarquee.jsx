"use client";
import React, { useMemo } from "react";
import MarqueeRow from "./MarqueeRow";

export default function PortfolioMarquee({ slides }) {
  const { row1, row2 } = useMemo(() => {
    if (!slides || slides.length === 0) return { row1: [], row2: [] };

    // Dark theme projects on Top Row (Row 1), Light theme projects on Bottom Row (Row 2)
    const darkProjects = slides.filter((p) => p.theme === "dark");
    const lightProjects = slides.filter((p) => p.theme === "light");

    return {
      row1: darkProjects.length ? darkProjects : slides.slice(0, Math.ceil(slides.length / 2)),
      row2: lightProjects.length ? lightProjects : slides.slice(Math.ceil(slides.length / 2)),
    };
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="portfolio-marquee relative z-20 pointer-events-auto w-full flex flex-col pt-16 sm:pt-24 md:pt-28 pb-4">
      {/* Top Header - shifted slightly down so it completely clears the fixed navbar */}
      <div
        className="relative w-full px-4 sm:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-2"
        style={{ transform: "translateY(12px)" }}
      >
        {/* Left: Projects Count Badge */}
        <div className="w-full sm:w-auto flex justify-start sm:justify-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] sm:text-[13px] md:text-[14px] font-mono uppercase tracking-wider text-white font-bold">
              Projects Count — {slides.length}
            </span>
          </div>
        </div>

        {/* Center: Bold Grand Title */}
        <div className="text-center sm:absolute sm:left-1/2 sm:-translate-x-1/2 mt-1 sm:mt-0">
          <p className="text-[10px] sm:text-[12px] tracking-[0.3em] uppercase text-white/50 font-mono mb-0.5 sm:mb-1 font-semibold">
            Selected Works
          </p>
          <h2 className="text-[clamp(1.3rem,4.5vw,3.2rem)] font-extrabold uppercase tracking-tight leading-none text-white whitespace-nowrap drop-shadow-lg">
            Project Made <span className="font-light italic normal-case tracking-normal text-white/85">by Founders</span>
          </h2>
        </div>

        {/* Right placeholder to keep header balanced */}
        <div className="hidden sm:block w-[180px]" aria-hidden="true" />
      </div>

      {/* 2 rows physically shifted down into the bottom empty space */}
      <div
        className="flex flex-col gap-2.5 sm:gap-3 md:gap-5 mt-4 sm:mt-6"
        style={{ transform: "translateY(24px)" }}
      >
        <MarqueeRow projects={row1} isRTL={true} speed={32} />
        <MarqueeRow projects={row2} isRTL={false} speed={34} />
      </div>

      {/* subtle fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-20 bg-gradient-to-r from-[#050505]/80 md:from-black/60 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-20 bg-gradient-to-l from-[#050505]/80 md:from-black/60 to-transparent z-10" />
    </div>
  );
}

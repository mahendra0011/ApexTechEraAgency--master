"use client";
import React, { useEffect, useRef, useMemo, memo } from "react";
import { getReelRows } from "./techStackData";
import ReelRow from "./ReelRow";

function TechReelGallery({
  rows = 7,
  rowHeight = 92,
  rowGap = 20,
  itemGap = 16,
  tilt = 5,
  arch = 32,
  speed = 1,
  speedVariance = 0.55,
  alternate = true,
  autoScroll = 20,
  inertia = 0.92,
  damping = 0.10,
  radius = 12,
  grayscale = 0,
  focusRadius = 210,
  focusStrength = 0,
  fade = 0.06,
  dim = 0,
  taper = 0,
  interactive = true,
}) {
  const wrapperRef = useRef(null);
  const reelsRef = useRef(null);
  const rowsData = useMemo(() => getReelRows(rows), [rows]);

  // No dull filters - logos stay crisp and bright
  // Removed grayscale/dim spotlight logic per user request (only logos, no text, no dhundla)

  // Keyboard arrows (when focused)
  useEffect(() => {
    if (!interactive) return;
    const onKey = (e) => {
      const wrapper = wrapperRef.current;
      if (!wrapper || !wrapper.matches(":hover")) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        // Dispatch wheel-like inertia via custom event? For now just trigger reels velocity
        // Let ReelRow handle via wheel, we simulate
        const delta = e.key === "ArrowRight" ? 120 : -120;
        wrapper.querySelectorAll(".reel-row").forEach((row) => {
          row.dispatchEvent(new WheelEvent("wheel", { deltaX: delta, bubbles: true }));
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [interactive]);

  const totalHeight = rows * rowHeight + (rows - 1) * rowGap;

  return (
    <section
      ref={wrapperRef}
      className="tech-reel-gallery relative w-full overflow-hidden bg-[#ffffff] select-none"
      style={{
        padding: "16px 0",
      }}
    >

      {/* Reels viewport with tilt + arch + fade */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: totalHeight,
          // Fade edges via mask
          maskImage: `linear-gradient(to right, transparent 0, black ${fade * 100}%, black ${100 - fade * 100}%, transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to right, transparent 0, black ${fade * 100}%, black ${100 - fade * 100}%, transparent 100%)`,
        }}
      >
        {/* Center text - Strictly 2 lines: "WHAT TECH STACK WE USE" / "TO BUILD PROJECTS" - matching Meet Founder font */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-2 sm:px-4">
          <div
            className="flex flex-col items-center justify-center text-center px-4 sm:px-10 py-4 sm:py-6"
            style={{
              background: "radial-gradient(ellipse at center, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.6) 65%, transparent 100%)",
            }}
          >
            <h3
              className="text-center"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(1.25rem, 5.8vw, 5.8rem)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                color: "#000000",
                textShadow: "0 2px 6px rgba(255,255,255,0.95), 0 10px 30px rgba(255,255,255,0.95), 0 14px 40px rgba(0,0,0,0.07)",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ display: "block", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, whiteSpace: "nowrap" }}>
                WHAT TECH STACK WE USE
              </span>
              <span style={{ display: "block", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, whiteSpace: "nowrap" }}>
                TO BUILD PROJECTS
              </span>
            </h3>
          </div>
        </div>
        <div
          ref={reelsRef}
          className="relative w-full"
          style={{
            height: totalHeight,
            transform: `perspective(1200px) rotateZ(${tilt}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="flex flex-col" style={{ gap: rowGap }}>
            {rowsData.map((items, idx) => {
              const center = (rows - 1) / 2;
              const distFromCenter = Math.abs(idx - center) / center; // 0 center, 1 outer
              const archOffset = arch * Math.sin((idx / (rows - 1)) * Math.PI) * 0.6; // arch across frame
              const dimOpacity = 1 - dim * distFromCenter;
              const taperScale = 1 - taper * distFromCenter;

              return (
                <div
                  key={idx}
                  className="reel-row-wrap relative w-[130%] -ml-[15%]"
                  style={{
                    height: rowHeight,
                    transform: `translateX(${archOffset}px) scale(${taperScale})`,
                    opacity: dimOpacity,
                    transformOrigin: "center",
                  }}
                >
                  <ReelRow
                    items={items}
                    rowHeight={rowHeight}
                    itemGap={itemGap}
                    isAlternate={alternate ? idx % 2 === 1 : false}
                    speedVariance={speedVariance}
                    autoScroll={autoScroll * speed}
                    rowIndex={idx}
                    rows={rows}
                    interactive={interactive}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(TechReelGallery);

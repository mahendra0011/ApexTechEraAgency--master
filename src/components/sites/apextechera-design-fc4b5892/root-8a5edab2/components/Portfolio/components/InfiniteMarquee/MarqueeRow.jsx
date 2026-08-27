"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import MarqueeCard from "./MarqueeCard";

gsap.registerPlugin(Observer);

export default function MarqueeRow({ projects, isRTL = true, speed = 28 }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Premium GSAP infinite marquee - independent per row
    const ctx = gsap.context(() => {
      // Ensure track is on GPU layer for smooth 60fps
      gsap.set(track, { force3D: true, willChange: "transform" });

      // Infinite tween: RTL -> 0 to -50%, LTR -> -50% to 0
      const tween = gsap.fromTo(
        track,
        { xPercent: isRTL ? 0 : -50 },
        {
          xPercent: isRTL ? -50 : 0,
          duration: speed,
          ease: "none",
          repeat: -1,
          overwrite: "auto",
        }
      );

      // Instant & reliable hover pause
      let isPaused = false;

      const onEnter = () => {
        isPaused = true;
        tween.pause();
      };
      const onLeave = () => {
        isPaused = false;
        if (!document.body.classList.contains("is-dragging")) {
          tween.play();
        }
      };

      container.addEventListener("mouseenter", onEnter);
      container.addEventListener("mouseleave", onLeave);
      container.addEventListener("pointerenter", onEnter);
      container.addEventListener("pointerleave", onLeave);

      // Independent drag per row - Observer
      const observer = Observer.create({
        target: container,
        type: "pointer,touch",
        dragMinimum: 2,
        onPress: () => {
          tween.pause();
          document.body.classList.add("is-dragging");
          gsap.set(container, { cursor: "grabbing" });
        },
        onRelease: () => {
          document.body.classList.remove("is-dragging");
          gsap.set(container, { clearProps: "cursor" });
          const isHover = container.matches(":hover");
          if (!isHover) {
            tween.play();
          }
        },
        onDrag: (self) => {
          const delta = self.deltaX * 0.0009;
          const wrapped = gsap.utils.wrap(0, 1, tween.progress() + (isRTL ? -delta : delta));
          tween.progress(wrapped);
        },
      });

      return () => {
        container.removeEventListener("mouseenter", onEnter);
        container.removeEventListener("mouseleave", onLeave);
        container.removeEventListener("pointerenter", onEnter);
        container.removeEventListener("pointerleave", onLeave);
        observer.kill();
        tween.kill();
      };
    }, container);

    return () => ctx.revert();
  }, [isRTL, speed]);

  if (!projects || projects.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="marquee-row relative z-20 w-full py-2 md:py-2.5 cursor-grab active:cursor-grabbing select-none overflow-hidden pointer-events-auto"
      style={{ willChange: "transform" }}
    >
      {/* Track: w-max contains 2 identical groups for seamless -50% loop */}
      <div
        ref={trackRef}
        className="flex w-max will-change-transform"
        style={{ willChange: "transform", backfaceVisibility: "hidden", perspective: 1000 }}
      >
        {/* Group 1 */}
        <div className="flex items-center shrink-0 gap-6 md:gap-8 pr-6 md:pr-8">
          {projects.map((p, idx) => (
            <MarqueeCard key={`a-${p.poster || p.id || idx}-${idx}`} project={p} />
          ))}
        </div>
        {/* Group 2 - clone, marks seamless point */}
        <div className="flex items-center shrink-0 gap-6 md:gap-8 pr-6 md:pr-8" aria-hidden="true">
          {projects.map((p, idx) => (
            <MarqueeCard key={`b-${p.poster || p.id || idx}-${idx}`} project={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

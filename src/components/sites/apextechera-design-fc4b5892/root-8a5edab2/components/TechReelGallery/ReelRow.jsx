"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import TechCard from "./TechCard";

gsap.registerPlugin(Observer);

export default function ReelRow({
  items,
  rowHeight = 92,
  itemGap = 16,
  isAlternate = false,
  speedVariance = 0.55,
  autoScroll = 26,
  rowIndex = 0,
  rows = 6,
  interactive = true,
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // speed variance per row: center rows faster, outer slower or random
    const variance = 1 + (Math.random() * speedVariance * 2 - speedVariance); // 0.45 to 1.55
    // Alternate direction
    const direction = isAlternate ? -1 : 1;
    // Convert autoScroll pixels per second to duration: need track width
    // We'll use xPercent tween for seamless, duration = (trackWidth / autoScroll) * variance inverse
    // Simpler: duration = 80 / (autoScroll * variance) * 26 baseline

    const ctx = gsap.context(() => {
      gsap.set(track, { force3D: true, willChange: "transform" });

      // Use xPercent for seamless loop - need duplicated content (2x)
      // Direction handled by from/to values
      const tween = gsap.fromTo(
        track,
        { xPercent: direction === 1 ? 0 : -50 },
        {
          xPercent: direction === 1 ? -50 : 0,
          duration: 60 / (autoScroll / 26) / variance, // baseline 60s at 26px/s
          ease: "none",
          repeat: -1,
        }
      );

      // Interactive controls: drag, wheel, smooth damping
      let currentSpeed = 1;
      let targetSpeed = 1;
      let velocity = 0;
      const inertia = 0.92;
      const damping = 0.10;

      const onEnter = () => { targetSpeed = 0.15; }; // slow on hover, not full stop for premium
      const onLeave = () => {
        if (!document.body.classList.contains("is-reel-dragging")) targetSpeed = 1;
      };
      container.addEventListener("mouseenter", onEnter);
      container.addEventListener("mouseleave", onLeave);

      // ticker lerp for damping
      const ticker = () => {
        // inertia decay
        velocity *= inertia;
        // damping catch up
        currentSpeed += (targetSpeed - currentSpeed) * damping;
        // add velocity influence
        const effective = currentSpeed + velocity * 0.04;
        tween.timeScale(effective);
      };
      gsap.ticker.add(ticker);

      let observer = null;
      let wheelObserver = null;
      if (interactive) {
        observer = Observer.create({
          target: container,
          type: "pointer,touch",
          dragMinimum: 2,
          onPress: () => {
            document.body.classList.add("is-reel-dragging");
            targetSpeed = 0;
            velocity = 0;
          },
          onRelease: () => {
            document.body.classList.remove("is-reel-dragging");
            targetSpeed = 1;
          },
          onDrag: (self) => {
            const delta = self.deltaX * 0.008 * (1.6 / 1.6); // dragSensitivity 1.6
            velocity += delta;
            // scrub tween progress directly for instant drag
            const progDelta = delta * 0.003;
            tween.progress(gsap.utils.wrap(0, 1, tween.progress() - progDelta * direction));
          },
        });

        // Wheel support
        const onWheel = (e) => {
          // only if cursor over this row container
          if (!container.matches(":hover")) return;
          const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
          velocity += delta * 0.008 * 1.0; // wheelSensitivity 1.0
          // prevent page scroll hijack? allow but damp
          e.preventDefault?.();
        };
        container.addEventListener("wheel", onWheel, { passive: false });

        wheelObserver = { kill: () => container.removeEventListener("wheel", onWheel) };
      }

      return () => {
        container.removeEventListener("mouseenter", onEnter);
        container.removeEventListener("mouseleave", onLeave);
        gsap.ticker.remove(ticker);
        observer && observer.kill();
        wheelObserver && wheelObserver.kill();
        tween.kill();
      };
    }, container);

    return () => ctx.revert();
  }, [isAlternate, speedVariance, autoScroll, rowIndex, rows]);

  if (!items || items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="reel-row relative w-full overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none"
      style={{ height: rowHeight }}
    >
      <div
        ref={trackRef}
        className="flex w-max will-change-transform items-center"
        style={{
          gap: itemGap,
          height: rowHeight,
          willChange: "transform",
          backfaceVisibility: "hidden",
          perspective: 1000,
        }}
      >
        {/* Group A */}
        <div className="flex items-center shrink-0" style={{ gap: itemGap, height: rowHeight, paddingRight: itemGap }}>
          {items.map((tech, idx) => (
            <TechCard key={`a-${tech.name}-${idx}`} tech={tech} rowHeight={rowHeight - 8} />
          ))}
        </div>
        {/* Group B clone */}
        <div className="flex items-center shrink-0" style={{ gap: itemGap, height: rowHeight, paddingRight: itemGap }} aria-hidden="true">
          {items.map((tech, idx) => (
            <TechCard key={`b-${tech.name}-${idx}`} tech={tech} rowHeight={rowHeight - 8} />
          ))}
        </div>
      </div>
    </div>
  );
}

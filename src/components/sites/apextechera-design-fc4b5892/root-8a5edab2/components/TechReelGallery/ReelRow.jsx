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

    const variance = 1 + (Math.random() * speedVariance * 2 - speedVariance);
    const direction = isAlternate ? -1 : 1;

    const isCoarsePointer = typeof window !== "undefined" &&
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

    const ctx = gsap.context(() => {
      gsap.set(track, { force3D: true, willChange: "transform" });

      const tween = gsap.fromTo(
        track,
        { xPercent: direction === 1 ? 0 : -50 },
        {
          xPercent: direction === 1 ? -50 : 0,
          duration: 60 / (autoScroll / 26) / variance,
          ease: "none",
          repeat: -1,
        }
      );

      if (isCoarsePointer) {
        return () => { tween.kill(); };
      }

      let currentSpeed = 1;
      let targetSpeed = 1;
      let velocity = 0;
      const inertia = 0.92;
      const damping = 0.10;

      const onEnter = () => { targetSpeed = 0.15; };
      const onLeave = () => {
        if (!document.body.classList.contains("is-reel-dragging")) targetSpeed = 1;
      };
      container.addEventListener("mouseenter", onEnter);
      container.addEventListener("mouseleave", onLeave);

      const ticker = () => {
        velocity *= inertia;
        currentSpeed += (targetSpeed - currentSpeed) * damping;
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
            const delta = self.deltaX * 0.008 * (1.6 / 1.6);
            velocity += delta;
            const progDelta = delta * 0.003;
            tween.progress(gsap.utils.wrap(0, 1, tween.progress() - progDelta * direction));
          },
        });

        const onWheel = (e) => {
          if (!container.matches(":hover")) return;
          const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
          velocity += delta * 0.008 * 1.0;
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
      className="reel-row relative w-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{ height: rowHeight, touchAction: "pan-y" }}
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
        <div className="flex items-center shrink-0" style={{ gap: itemGap, height: rowHeight, paddingRight: itemGap }}>
          {items.map((tech, idx) => (
            <TechCard key={`a-${tech.name}-${idx}`} tech={tech} rowHeight={rowHeight - 8} />
          ))}
        </div>
        <div className="flex items-center shrink-0" style={{ gap: itemGap, height: rowHeight, paddingRight: itemGap }} aria-hidden="true">
          {items.map((tech, idx) => (
            <TechCard key={`b-${tech.name}-${idx}`} tech={tech} rowHeight={rowHeight - 8} />
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { HeroAstronautScene } from "./HeroAstronautScene";
import { useTransform } from "../../../../lib/sites/apextechera-design-fc4b5892/Controller/hooks/useTransform/index";
import { ControllerContext } from "../../../../lib/sites/apextechera-design-fc4b5892/Controller/Controller";

function AnimatedLine({ text, started }: { text: string; started: boolean }) {
  const order = useMemo(() => {
    const pseudo = (i: number) => {
      const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    return text
      .split("")
      .map((_, i) => i)
      .sort((a, b) => pseudo(a) - pseudo(b));
  }, [text]);
  return (
    <span className="line block" style={{ fontFamily: "inherit" }}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="char inline-block"
          style={{
            fontFamily: "inherit",
            opacity: started ? 1 : 0,
            transform: started ? "scaleY(1)" : "scaleY(0)",
            transformOrigin: "bottom center",
            transition: `transform 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${order.indexOf(i) * 50}ms, opacity 0.9s ease ${order.indexOf(i) * 50}ms`,
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

interface Props {
  id?: string;
}

export function HeroSection({ id }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const wheelRef = useRef(0);
  const cameraInRef = useRef({ start: -1 });
  const { activeId } = useContext(ControllerContext);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (activeId === id) {
      setEntered(true);
      cameraInRef.current.start = performance.now();
    } else {
      setEntered(false);
    }
  }, [activeId, id]);

  const WHEEL_MAX = 3467;
  const END_RANGE = 770;

  function apply(wheel: number) {
    wheelRef.current = wheel;
    if (stageRef.current) {
      const w = Math.max(0, Math.min(wheel, WHEEL_MAX));
      const start = WHEEL_MAX - END_RANGE;
      let counter: number;
      if (w <= start) {
        counter = w;
      } else {
        const f = (w - start) / END_RANGE;
        const s = f * f * (3 - 2 * f);
        counter = w - END_RANGE * s;
      }
      stageRef.current.style.transform = `translate3d(0, ${counter}px, 0)`;

      // As you scroll down (w increases), text scrolls upward behind the 3D model
      if (titleRef.current) {
        const yOffset = -w * 0.9;
        titleRef.current.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      }
    }
  }

  (useTransform as any)(
    { onChange: ({ wheel }: { wheel: any }) => apply(wheel) },
    { id, parent: trackRef, target: trackRef }
  );

  return (
    <div id="hero-anim" ref={trackRef} className="relative" style={{ height: "calc(3467px + 100vh)" }}>
      <div
        ref={stageRef}
        className="absolute inset-x-0 top-0 z-[1] h-screen overflow-hidden"
      >
        {/* Giant Title placed BEHIND the 3D model (z-[1]) with scroll translation */}
        <div className="pointer-events-none absolute inset-x-0 top-[24%] sm:top-[22%] lg:top-0 z-[1] px-4 sm:px-10 lg:px-10">
          <h1
            ref={titleRef}
            className="select-none whitespace-nowrap text-center text-[min(41.5vw,600px)] font-normal uppercase leading-[0.88] text-[#16a34a] lg:pt-[52px] will-change-transform"
            style={{ fontFamily: "'Dimensions', sans-serif" }}
          >
            <AnimatedLine text="APEXTECHERA" started={entered} />
          </h1>
        </div>

        {/* 3D Model Astronaut Scene at z-[2] in FRONT of the text */}
        <HeroAstronautScene trackRef={trackRef} wheelRef={wheelRef} cameraInRef={cameraInRef} />

        <div className="absolute inset-x-0 bottom-0 z-[3] px-4 pb-12 sm:px-10 sm:pb-16">
          <div className="flex items-end justify-between gap-4 sm:gap-8">
            <div className="mb-2 sm:mb-16">
              <div className="mb-2 sm:mb-6 text-[min(4.2vw,32px)] lg:text-[min(3vw,32px)] font-normal uppercase leading-[0.95] tracking-[-0.5px] sm:tracking-[-1px] text-foreground [font-family:RmNeue]">
                A Tech Agency
              </div>
              <div className="text-[min(6vw,79.2px)] lg:text-[min(7vw,79.2px)] font-normal uppercase leading-[0.95] tracking-[-1px] sm:tracking-[-1.6px] text-[#71717a] [font-family:RmNeue]">
                Based in
              </div>
              <div className="text-[min(6vw,79.2px)] lg:text-[min(7vw,79.2px)] font-normal uppercase leading-[0.95] tracking-[-1px] sm:tracking-[-1.6px] text-foreground [font-family:RmNeue]">
                India
              </div>
            </div>
            <div className="text-right mb-2 sm:mb-16">
              <div className="text-[min(6vw,79.2px)] lg:text-[min(7vw,79.2px)] font-normal uppercase leading-[0.95] tracking-[-1px] sm:tracking-[-1.6px] text-[#71717a] [font-family:RmNeue]">
                Working
              </div>
              <div className="text-[min(6vw,79.2px)] lg:text-[min(7vw,79.2px)] font-normal uppercase leading-[0.95] tracking-[-1px] sm:tracking-[-1.6px] text-foreground [font-family:RmNeue]">
                Worldwide
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
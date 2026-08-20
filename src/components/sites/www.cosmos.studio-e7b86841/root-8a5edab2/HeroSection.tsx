"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { HeroAstronautScene } from "./HeroAstronautScene";
import { useTransform } from "../../../../lib/sites/qclay-design-fc4b5892/Controller/hooks/useTransform/index";
import { ControllerContext } from "../../../../lib/sites/qclay-design-fc4b5892/Controller/Controller";

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
    <span className="line block">
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="char inline-block"
          style={{
            opacity: started ? 1 : 0,
            transform: started ? "scaleY(1)" : "scaleY(0)",
            transition: `transform 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${order.indexOf(i) * 40}ms, opacity 0.9s ease ${order.indexOf(i) * 40}ms`,
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
    }
  }

  useTransform(
    { onChange: ({ wheel }) => apply(wheel) },
    { id, parent: trackRef, target: trackRef }
  );

  return (
    <div id="hero-anim" ref={trackRef} className="relative" style={{ height: "calc(3467px + 100vh)" }}>
      <div ref={stageRef} className="absolute inset-x-0 top-0 z-[1] h-screen">
        <HeroAstronautScene trackRef={trackRef} wheelRef={wheelRef} cameraInRef={cameraInRef} />

        <div className="pointer-events-none absolute inset-0 z-[4] lg:hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/sites/www.cosmos.studio-e7b86841/root-8a5edab2/images/poster.webp"
            className="absolute left-1/2 top-[55%] aspect-video w-[86%] -translate-x-1/2 -translate-y-1/2 object-cover"
          >
            <source src="/sites/qclay-design-fc4b5892/root-8a5edab2/video/tech-agency-logo.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-[3] px-10 pb-16">
          <div className="flex items-end justify-between gap-8">
            <div className="mb-16">
              <div className="mb-6 text-[min(3vw,32px)] font-normal uppercase leading-[0.95] tracking-[-1px] text-foreground [font-family:RmNeue]">
                A Tech Agency
              </div>
              <div className="text-[min(7vw,79.2px)] font-normal uppercase leading-[0.95] tracking-[-1.6px] text-[#71717a] [font-family:RmNeue]">
                Based in
              </div>
              <div className="text-[min(7vw,79.2px)] font-normal uppercase leading-[0.95] tracking-[-1.6px] text-foreground [font-family:RmNeue]">
                India
              </div>
            </div>
            <div className="text-right">
              <div className="text-[min(7vw,79.2px)] font-normal uppercase leading-[0.95] tracking-[-1.6px] text-[#71717a] [font-family:RmNeue]">
                Working
              </div>
              <div className="text-[min(7vw,79.2px)] font-normal uppercase leading-[0.95] tracking-[-1.6px] text-foreground [font-family:RmNeue]">
                Worldwide
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 px-4 sm:px-10 lg:px-10">
        <h1 className="select-none whitespace-nowrap pt-10 text-center text-[calc(40.4vw-6px)] font-normal uppercase leading-[0.85] text-[#16a34a] [font-family:Dimensions] lg:pt-[52px] lg:text-[min(41.5vw,600px)]">
          <AnimatedLine text="ApexTechEra" started={entered} />
        </h1>
      </div>
    </div>
  );
}
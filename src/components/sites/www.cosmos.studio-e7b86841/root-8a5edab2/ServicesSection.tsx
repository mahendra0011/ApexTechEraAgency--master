"use client";

import { useEffect, useRef, useState } from "react";

const CAROUSEL_WORDS = ["UI/UX DESIGN", "WEBSITES", "PRODUCTS", "BRAND IDENTITY", "MOTION"];

const PARAGRAPH_LINES = [
  "We specialize in creating emotional,",
  "animated interfaces and wow",
  "websites that make complex SaaS",
  "products more human and",
  "appealing to use while ensuring",
  "great UX.",
];

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh * 0.7 && rect.bottom > 0) setInView(true);
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
      setCarouselIndex(Math.min(CAROUSEL_WORDS.length - 1, Math.floor(progress * CAROUSEL_WORDS.length)));
    };
    onScroll();
    window.addEventListener("customwheel", onScroll);
    return () => window.removeEventListener("customwheel", onScroll);
  }, []);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      let n = 0;
      const id = setInterval(() => {
        n += 4;
        setCount(Math.min(400, n));
        if (n >= 400) clearInterval(id);
      }, 20);
    }, 300);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <section ref={sectionRef} className="relative z-[3] px-4 pt-24 sm:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-2 text-[16px] uppercase tracking-[0.2em] text-foreground">
            <span>WE DO</span>
          </div>
          <div className="text-[min(9vw,108px)] font-normal uppercase leading-[0.95] text-[#9d9c9a] [font-family:RmNeue]">
            Immersive
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[332px_1fr]">
          <div className="text-[20px] leading-[1.4] text-foreground">
            {PARAGRAPH_LINES.map((line, i) => (
              <div key={i} className="overflow-hidden">
                <div
                  className="translate-y-full transition-transform duration-700"
                  style={{
                    transform: inView ? "translateY(0)" : "translateY(100%)",
                    transitionDelay: `${i * 90}ms`,
                  }}
                >
                  {line}
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
            >
              {CAROUSEL_WORDS.map((word) => (
                <div
                  key={word}
                  className="min-w-full whitespace-nowrap text-[min(9vw,108px)] font-normal uppercase leading-[0.95] text-foreground [font-family:RmNeue]"
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 h-px w-full max-w-[1265px] bg-[#474747]" />

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-baseline gap-3 text-[16px] uppercase tracking-[0.2em] text-foreground">
            <span>{count}+</span>
            <span className="text-[#6a6a6a]">SUCCESSFULL PRJCTS</span>
            <span className="ml-6 text-[#6a6a6a]">2018-2023</span>
          </div>
          <div className="text-right text-[16px] uppercase leading-[1.2] tracking-[0.2em]">
            <div className="text-[#6a6a6a]">Start project =</div>
            <div className="text-foreground">3 weeks</div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div className="text-[16px] uppercase leading-[1.4] tracking-[0.2em] text-foreground">
            <div>UI/UX</div>
            <div>PRODUCT</div>
            <div>
              <span className="text-foreground">design</span>
            </div>
          </div>
          <div className="text-[16px] uppercase leading-[1.4] tracking-[0.2em] text-foreground">
            Motion
          </div>
          <div className="text-right text-[16px] uppercase leading-[1.4] tracking-[0.2em] text-foreground">
            <div>Business</div>
            <div>ANALITICS</div>
          </div>
        </div>
      </div>
    </section>
  );
}
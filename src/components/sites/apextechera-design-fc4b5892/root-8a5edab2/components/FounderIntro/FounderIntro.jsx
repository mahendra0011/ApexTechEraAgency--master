"use client";

import { memo, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useTransform } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/hooks/useTransform/index";
import { screens } from "../../constants";
import { setToRender, removeFromRender } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Animator/js/renderer";
import {
  Code2, Rocket, Palette, BrainCircuit, MonitorSmartphone, Users,
  Globe, ShieldCheck, TrendingUp, Zap, Star, Award,
} from "lucide-react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const lerp = (a, b, t) => a + (b - a) * t;

const FIELDS = [
  { icon: Globe, title: "Web Development", desc: "Scalable websites & web apps" },
  { icon: Code2, title: "Software Development", desc: "Custom software solutions" },
  { icon: MonitorSmartphone, title: "Mobile Apps", desc: "Android & iOS experiences" },
  { icon: Palette, title: "UI/UX Design", desc: "Beautiful, seamless interfaces" },
  { icon: BrainCircuit, title: "AI & ML", desc: "Intelligent AI solutions" },
  { icon: Rocket, title: "Branding & Marketing", desc: "Digital growth strategy" },
];

const STATS = [
  { icon: Users, value: 250, suffix: "+", label: "Happy Clients" },
  { icon: Rocket, value: 500, suffix: "+", label: "Projects Delivered" },
  { icon: Award, value: 12, suffix: "+", label: "Years of Experience" },
  { icon: TrendingUp, value: 98, suffix: "%", label: "Client Retention" },
];

const TECH_STACK = [
  { icon: Code2, label: "React" },
  { icon: Zap, label: "Next.js" },
  { icon: ShieldCheck, label: "Node.js" },
  { icon: BrainCircuit, label: "Python" },
  { icon: Code2, label: "TypeScript" },
  { icon: Globe, label: "AWS" },
  { icon: Star, label: "Figma" },
  { icon: MonitorSmartphone, label: "Flutter" },
];

const SpinningBadge = () => (
  <span className="inline-flex items-center justify-center relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-2 md:mx-4 -mb-2 md:-mb-4 shrink-0 align-middle">
    <svg viewBox="0 0 100 100" className="w-full h-full fill-purple-400 animate-[spin_10s_linear_infinite]">
      <path id="circlePath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="none" />
      <text className="text-[13px] font-bold tracking-[0.18em] uppercase" fill="currentColor">
        <textPath href="#circlePath" startOffset="0%">
          FOUNDER &bull; APEXTECHERA AGENCY &bull; FOUNDER &bull; APEXTECHERA AGENCY &bull;&nbsp;
        </textPath>
      </text>
    </svg>
    <Star className="absolute w-5 h-5 md:w-6 md:h-6 text-white" />
  </span>
);

const FounderIntro = memo(function FounderIntro() {
  const parentRef = useRef(null);
  const targetRef = useRef(null);
  const imageRef = useRef(null);
  const panelsRef = useRef([]);
  const progressRef = useRef(null);
  
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const tlRef = useRef(null);

  const { parent, target } = useTransform({ onChange }, { id: screens.FOUNDERINTRO });

  function onChange({ wheel }) {
    if (typeof wheel !== "number") return;
    if (target.current) {
      target.current.style.transform = `translate3d(0, ${wheel}px, 0)`;
    }
    if (parent.current) {
      const parentH = parent.current.getBoundingClientRect().height;
      const maxScroll = Math.max(1, parentH - window.innerHeight);
      targetProgressRef.current = clamp(wheel / maxScroll, 0, 1);
    }
  }

  useEffect(() => {
    // ----------------------------------------------------
    // GSAP TIMELINE SETUP
    // ----------------------------------------------------
    const tl = gsap.timeline({ paused: true });

    // Animate the progress bar
    if (progressRef.current) {
      tl.to(progressRef.current, { width: "100%", ease: "none", duration: 1 }, 0);
    }

    // Animate the Image (Parallax/Zoom effect)
    if (imageRef.current) {
       // Start slightly smaller, grow slightly as you scroll
       tl.fromTo(
         imageRef.current,
         { scale: 1, y: 0 },
         { scale: 1.05, y: -20, ease: "none", duration: 1 },
         0
       );
    }

    // Animate the panels in sequence
    panelsRef.current.forEach((panel, i) => {
      if (!panel) return;
      
      if (i !== 0) {
        tl.fromTo(
          panel,
          { autoAlpha: 0, y: 50, scale: 0.95 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.15, ease: "power2.out" },
          (i * 0.25)
        );
      } else {
        gsap.set(panel, { autoAlpha: 1, y: 0, scale: 1 });
      }
      
      if (i !== panelsRef.current.length - 1) {
        tl.to(
          panel,
          { autoAlpha: 0, y: -50, scale: 1.05, duration: 0.15, ease: "power2.in" },
          (i * 0.25) + 0.15
        );
      }
    });
    
    tlRef.current = tl;

    // ----------------------------------------------------
    // RENDER LOOP
    // ----------------------------------------------------
    const label = `FounderIntroAnimation_${Date.now()}`;
    const renderLoop = () => {
      currentProgressRef.current = lerp(currentProgressRef.current, targetProgressRef.current, 0.1);
      const p = currentProgressRef.current;
      
      if (tlRef.current) {
        tlRef.current.progress(p);
      }
    };
    setToRender({ label, handler: renderLoop });

    return () => {
      removeFromRender(label);
      if (tlRef.current) tlRef.current.kill();
    };
  }, []);

  return (
    <section ref={parent} id="founder-intro" className="relative w-full h-[500vh] bg-[#000000] text-white select-none z-10 overflow-hidden">
      {/* Background gradients for cinematic feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/30 via-black to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-black/0 to-transparent pointer-events-none" />

      {/* The sticky container */}
      <div ref={target} className="sticky top-0 w-full h-screen overflow-hidden will-change-transform">
        <div className="relative z-10 w-full h-full max-w-[1500px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          
          {/* Left Side: Text Panels */}
          <div className="relative flex-1 w-full h-full lg:max-w-2xl flex flex-col justify-center pb-20">
            
            <div className="relative w-full h-[55vh] flex items-center">
              
              {/* PANEL 1: Introduction */}
              <div ref={el => panelsRef.current[0] = el} className="absolute inset-0 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-purple-500 text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-4">
                    <span className="w-8 h-[2px] bg-purple-500" />
                    01 — Introduction
                  </div>
                  <h2 className="font-clash text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
                    Meet The <SpinningBadge /> Founder <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                      Behind ApexTechEra
                    </span>
                  </h2>
                  <p className="mt-6 font-helvetica text-base md:text-lg text-neutral-400 leading-relaxed max-w-xl">
                    The visionary leader driving ApexTechEra Agency forward with passion, creativity, and a relentless commitment to delivering world-class digital solutions.
                  </p>
              </div>

              {/* PANEL 2: Expertise */}
              <div ref={el => panelsRef.current[1] = el} className="absolute inset-0 flex flex-col justify-center invisible opacity-0">
                  <div className="flex items-center gap-3 text-blue-500 text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-4">
                    <span className="w-8 h-[2px] bg-blue-500" />
                    02 — Expertise
                  </div>
                  <h3 className="font-clash text-4xl md:text-5xl font-bold text-white tracking-tight">Core Competencies</h3>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {FIELDS.map((f) => (
                      <div key={f.title} className="group flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md p-4 hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-purple-500/20 transition-colors">
                          <f.icon className="shrink-0 w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-helvetica font-semibold text-white text-sm">{f.title}</h4>
                          <p className="font-helvetica text-xs text-neutral-400 mt-1">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>

              {/* PANEL 3: Stats */}
              <div ref={el => panelsRef.current[2] = el} className="absolute inset-0 flex flex-col justify-center invisible opacity-0">
                  <div className="flex items-center gap-3 text-emerald-500 text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-4">
                    <span className="w-8 h-[2px] bg-emerald-500" />
                    03 — Impact
                  </div>
                  <h3 className="font-clash text-4xl md:text-5xl font-bold text-white tracking-tight">Impact in Numbers</h3>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {STATS.map((s) => (
                      <div key={s.label} className="relative overflow-hidden flex flex-col gap-1 rounded-xl border border-white/5 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md p-5">
                        <s.icon className="w-6 h-6 text-emerald-400 mb-1" />
                        <span className="font-clash text-4xl font-bold text-white tracking-tight">
                          {s.value}<span className="text-emerald-400">{s.suffix}</span>
                        </span>
                        <span className="font-helvetica text-sm font-medium text-neutral-400">{s.label}</span>
                      </div>
                    ))}
                  </div>
              </div>

              {/* PANEL 4: Tech Stack */}
              <div ref={el => panelsRef.current[3] = el} className="absolute inset-0 flex flex-col justify-center invisible opacity-0">
                  <div className="flex items-center gap-3 text-pink-500 text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-4">
                    <span className="w-8 h-[2px] bg-pink-500" />
                    04 — Technology
                  </div>
                  <h3 className="font-clash text-4xl md:text-5xl font-bold text-white tracking-tight">Tech Stack</h3>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {TECH_STACK.map((t) => (
                      <div key={t.label} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-md px-4 py-2">
                        <t.icon className="w-4 h-4 text-pink-400" />
                        <span className="font-helvetica text-sm font-medium text-white">{t.label}</span>
                      </div>
                    ))}
                  </div>
              </div>

            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-[10vh] w-full max-w-md">
              <div className="h-[2px] w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  ref={progressRef}
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          </div>

          {/* Right Side: Founder Image */}
          <div className="relative w-full h-[40vh] lg:h-full lg:w-[45%] flex items-end justify-center shrink-0 lg:pt-20">
            <div
              ref={imageRef}
              className="relative w-[90%] max-w-[500px] h-[90%] max-h-[800px] origin-bottom drop-shadow-[0_0_40px_rgba(168,85,247,0.15)]"
            >
              <Image
                src="/sites/apextechera-design-fc4b5892/root-8a5edab2/images/profile-yes2.png"
                alt="Founder"
                fill
                className="object-contain object-bottom pointer-events-none"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default FounderIntro;
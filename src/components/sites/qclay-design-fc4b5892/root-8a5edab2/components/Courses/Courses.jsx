import { memo, useRef } from "react";
import { useTransform } from "../../../../../../lib/sites/qclay-design-fc4b5892/Controller/hooks/useTransform/index";
import { screens } from "../../constants";
import {
  Clock, FileText, MessageCircle, CalendarDays, Target, Wrench,
  Palette, RefreshCw, CheckCircle, Zap, Users, Repeat, MonitorSmartphone,
  Gauge, ShieldCheck, Rocket, Shield, TrendingUp, Video, Route, PenTool,
  Code, Bug, ArrowRight,
} from "lucide-react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const CARDS = [
  {
    step: "01",
    visual: Video,
    title: "Discovery Call: Understanding Your Vision",
    desc: "We start by learning your business goals, target users, and technical requirements — no assumptions, just clarity before we build.",
    stats: [
      { icon: Clock, value: "30-45 Min", label: "Free Call" },
      { icon: FileText, value: "Detailed", label: "Requirement Doc" },
      { icon: MessageCircle, value: "Direct", label: "Founder Access" },
    ],
    cta: "Book Discovery Call",
    dark: false,
  },
  {
    step: "02",
    visual: Route,
    title: "Planning & Strategy: Your Roadmap to Launch",
    desc: "We map out the full project timeline, choose the right tech stack, and break the build into clear milestones you can track.",
    stats: [
      { icon: CalendarDays, value: "2-3 Days", label: "Timeline" },
      { icon: Target, value: "Milestone", label: "Based Delivery" },
      { icon: Wrench, value: "Custom", label: "Tech Stack Pick" },
    ],
    cta: "See Our Process",
    dark: true,
  },
  {
    step: "03",
    visual: PenTool,
    title: "Design (UI/UX): From Wireframe to Reality",
    desc: "Every screen is designed with your users in mind — wireframes first, then a polished, interactive prototype before a single line of code.",
    stats: [
      { icon: Palette, value: "Figma", label: "Prototypes" },
      { icon: RefreshCw, value: "Unlimited", label: "Revisions" },
      { icon: CheckCircle, value: "Client", label: "Approval Step" },
    ],
    cta: "View Design Work",
    dark: false,
  },
  {
    step: "04",
    visual: Code,
    title: "Development: Built in Agile Sprints",
    desc: "Our developers build in 1-2 week sprints with weekly progress updates, so you always know exactly where your project stands.",
    stats: [
      { icon: Zap, value: "Weekly", label: "Progress Updates" },
      { icon: Users, value: "Dedicated", label: "Dev Team" },
      { icon: Repeat, value: "Agile", label: "Sprint Cycles" },
    ],
    cta: "Explore Our Stack",
    dark: true,
  },
  {
    step: "05",
    visual: Bug,
    title: "Testing & QA: Bug-Free, Performance-Optimized",
    desc: "Every feature is tested across devices and browsers, performance-audited, and stress-tested before it ever reaches your users.",
    stats: [
      { icon: MonitorSmartphone, value: "Multi-Device", label: "Testing" },
      { icon: Gauge, value: "Performance", label: "Audits" },
      { icon: ShieldCheck, value: "Security", label: "Checks" },
    ],
    cta: "Our QA Standards",
    dark: false,
  },
  {
    step: "06",
    visual: Rocket,
    title: "Launch & Support: We Don't Disappear After Launch",
    desc: "We handle deployment end-to-end, then stay on for ongoing support, updates, and scaling as your product grows.",
    stats: [
      { icon: Rocket, value: "Zero-Downtime", label: "Deployment" },
      { icon: Shield, value: "30-Day", label: "Free Support" },
      { icon: TrendingUp, value: "Scalable", label: "Infrastructure" },
    ],
    cta: "Start Your Project",
    dark: true,
  },
];

const Courses = memo(function Courses() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const layoutRef = useRef(null);

  function measure() {
    const el = sectionRef.current;
    const cards = cardsRef.current.filter(Boolean);
    if (!el || cards.length < 2) { return }
    const vh = window.innerHeight;
    const S = Math.round(0.55 * vh);
    cards.forEach((c) => { c.style.marginBottom = `${S}px` });
    const tops = cards.map((c) => c.offsetTop);
    const heights = cards.map((c) => c.offsetHeight);
    const gap = tops[1] - (tops[0] + heights[0]);
    const g = gap > 0 ? gap : 24;
    layoutRef.current = { tops, heights, gap: g, push: Math.round(0.3 * vh), vh };
    const last = cards[cards.length - 1];
    el.style.height = `${last.offsetTop - 100 + S + vh}px`;
  }

  function apply(wheel) {
    if (typeof wheel !== "number") { return }
    if (!layoutRef.current) { measure() }
    const L = layoutRef.current;
    if (!L) { return }
    const n = L.tops.length;
    const vh = L.vh;
    cardsRef.current.forEach((card, i) => {
      if (!card) { return }
      const h = L.heights[i];
      const N = L.tops[i];
      const stickStart = N - 100;
      let y = 0;
      if (wheel >= stickStart) {
        if (i < n - 1) {
          const pushStart = L.tops[i + 1] - 100;
          const ramp = clamp((wheel - pushStart) / L.push, 0, 1);
          y = (wheel - N + 100) - (h + L.gap) * ramp;
        } else {
          y = wheel - N + 100;
        }
      }
      const fadeStart = N - vh;
      const p = clamp((wheel - fadeStart) / (h * 0.7), 0, 1);
      card.style.opacity = String(p);
      card.style.transform = `translate3d(0, ${Math.round(y + (1 - p) * 40)}px, 0) scale(${(0.94 + 0.06 * p).toFixed(3)})`;
    });
  }

  useTransform(
    {
      onChange: ({ wheel }) => apply(wheel),
      onResize: () => measure(),
    },
    { id: screens.COURSES }
  );

  return (
    <section className="courses" ref={sectionRef}>
      <h1 className="courses__pill">
        Our Process
        <span className="courses__dot courses__dot--tl" />
        <span className="courses__dot courses__dot--tr" />
        <span className="courses__dot courses__dot--bl" />
        <span className="courses__dot courses__dot--br" />
      </h1>
      <h2 className="courses__subtitle">
        Not sure where to start? Don&apos;t worry, we&apos;re here to help.
      </h2>
      <div className="courses__cta-wrap">
        <button className="courses__cta" type="button">
          <span className="courses__cta-layer">
            <span>Start Your Project</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </span>
          <span className="courses__cta-layer" aria-hidden="true">
            <span>Start Your Project</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </span>
        </button>
      </div>

      {CARDS.map((card, i) => {
        const Visual = card.visual;
        return (
          <article
            key={card.step}
            ref={(el) => { cardsRef.current[i] = el }}
            className={`courses__card${card.dark ? " courses__card--dark" : ""}`}
          >
            <div className="courses__card-inner">
              <div className="courses__card-media">
                <Visual size={104} strokeWidth={1.4} />
              </div>
              <div className="courses__card-text">
                <div className="courses__step">
                  <span>Step</span>
                  <strong>{card.step}</strong>
                </div>
                <h3 className="courses__title">{card.title}</h3>
                <p className="courses__desc">{card.desc}</p>
                <div className="courses__stats">
                  {card.stats.map((s, j) => {
                    const StatIcon = s.icon;
                    return (
                      <div className="courses__stat" key={j}>
                        <div className="courses__stat-icon">
                          <StatIcon size={20} strokeWidth={2} />
                        </div>
                        <div className="courses__stat-text">
                          <strong>{s.value}</strong>
                          <span>{s.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="courses__btn" type="button">
                  <span className="courses__btn-layer">
                    <span>{card.cta}</span>
                    <ArrowRight size={17} strokeWidth={2.5} />
                  </span>
                  <span className="courses__btn-layer" aria-hidden="true">
                    <span>{card.cta}</span>
                    <ArrowRight size={17} strokeWidth={2.5} />
                  </span>
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
});

export default Courses;

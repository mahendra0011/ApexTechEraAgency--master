import { memo, useRef, useEffect } from "react";
import { useTransform } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/hooks/useTransform/index";
import { screens } from "../../constants";
import {
  Clock, FileText, MessageCircle, CalendarDays, Target, Wrench,
  Palette, RefreshCw, CheckCircle, Zap, Users, Repeat, MonitorSmartphone,
  Gauge, ShieldCheck, Rocket, Shield, TrendingUp, Video, Route, PenTool,
  Code, Bug, ArrowRight,
} from "lucide-react";

const CARDS = [
  {
    step: "01",
    visual: Video,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop",
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
    if (window.innerWidth <= 680) {
      cards.forEach((c) => { c.style.marginBottom = ""; c.style.transform = ""; });
      el.style.height = "auto";
      return;
    }
    const S = Math.max(32, Math.round(0.08 * vh));
    cards.forEach((c) => { c.style.marginBottom = `${S}px` });
    const tops = cards.map((c) => c.offsetTop);
    const heights = cards.map((c) => c.offsetHeight);

    const headerEls = [el.querySelector('.courses__pill'), el.querySelector('.courses__title'), el.querySelector('.courses__subtitle')].filter(Boolean);
    const stackTop = tops[0];
    const gap = 18; // 18px gap to reveal the card behind
    const stackStarts = tops.map((N, i) => Math.max(0, N - stackTop - (i * gap)));
    const releasePoint = stackStarts[stackStarts.length - 1] + vh * 0.15;

    layoutRef.current = { tops, heights, S, vh, stackTop, stackStarts, releasePoint, headerEls };
    el.style.height = `${releasePoint + vh}px`;
  }

  function apply(wheel) {
    if (typeof wheel !== "number") { return }
    if (window.innerWidth <= 680) { return }
    if (!layoutRef.current) { measure() }
    const L = layoutRef.current;
    if (!L) { return }

    L.headerEls.forEach((el) => {
      el.style.transform = `translate3d(0, ${Math.round(wheel)}px, 0)`;
    });

    const totalCards = cardsRef.current.length;

    cardsRef.current.forEach((card, i) => {
      if (!card) { return }
      const stackStart = L.stackStarts[i];

      let y = 0;
      let scale = 1;

      if (wheel >= stackStart) {
        y = wheel - stackStart;

        let cardsAbove = 0;
        for (let j = i + 1; j < totalCards; j++) {
          if (wheel >= L.stackStarts[j]) {
            cardsAbove += 1;
          } else {
            const prevStart = L.stackStarts[j - 1];
            const nextStart = L.stackStarts[j];
            if (nextStart > prevStart) {
              const progress = Math.max(0, Math.min(1, (wheel - prevStart) / (nextStart - prevStart)));
              cardsAbove += progress;
            }
            break;
          }
        }
        scale = Math.max(0.92, 1 - cardsAbove * 0.02);
      }

      card.style.opacity = "1";
      card.style.transform = `translate3d(0, ${Math.round(y)}px, 0) scale(${scale})`;
      card.style.transformOrigin = "top center";
    });
  }

  useTransform(
    {
      onChange: ({ wheel }) => apply(wheel),
      onResize: () => measure(),
    },
    { id: screens.COURSES, parent: sectionRef, target: sectionRef }
  );

  // Safety net: measure() was previously only ever triggered through the
  // hook's onResize callback, which silently no-ops until parent/target
  // refs are attached to real DOM nodes. Run it directly once mounted too,
  // so card layout (offsets, stick points, section height) is correct
  // before the very first scroll tick instead of only after it.
  useEffect(() => {
    measure();
    const id = setTimeout(measure, 300);
    let ready;
    if (document.fonts && document.fonts.ready) {
      ready = document.fonts.ready.then(() => setTimeout(measure, 100));
    }
    return () => {
      clearTimeout(id);
      if (ready) { ready.then(clearTimeout).catch(() => {}) }
    };
  }, []);

  return (
    <section className="courses" ref={sectionRef}>
      <h1 className="courses__pill">
        Our Process
        <span className="courses__dot courses__dot--tl" />
        <span className="courses__dot courses__dot--tr" />
        <span className="courses__dot courses__dot--bl" />
        <span className="courses__dot courses__dot--br" />
      </h1>
      <h2 className="courses__title">
        Not sure where to start?
      </h2>
      <p className="courses__subtitle">
        Don&apos;t worry, we&apos;re here to help.
      </p>

      {CARDS.map((card, i) => {
        const Visual = card.visual;
        return (
          <article
            key={card.step}
            ref={(el) => { cardsRef.current[i] = el }}
            className={`courses__card${card.dark ? " courses__card--dark" : ""}`}
            style={{ zIndex: i + 1 }}
          >
            <div className="courses__card-inner">
              <div className="courses__card-media" style={{ padding: 0, position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={card.image} 
                  alt={card.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    minHeight: '280px',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: card.dark 
                    ? 'linear-gradient(to top, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.1) 60%, transparent 100%)'
                    : 'linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.05) 60%, transparent 100%)',
                  pointerEvents: 'none'
                }} />
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  color: '#0f172a',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }}>
                  <Visual size={15} strokeWidth={2.4} color="#ea580c" />
                  <span>Step {card.step}</span>
                </div>
              </div>
              <div className="courses__card-text">
                <div className="courses__step">
                  <span>Step</span>
                  <strong>{card.step}</strong>
                </div>
                <h3 className="courses__card-title">{card.title}</h3>
                <p className="courses__desc">{card.desc}</p>
                <div className="courses__stats">
                  {card.stats.map((s, j) => {
                    const StatIcon = s.icon;
                    return (
                      <div className="courses__stat" key={j}>
                        <div className="courses__stat-icon">
                          <StatIcon size={20} strokeWidth={1.8} />
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
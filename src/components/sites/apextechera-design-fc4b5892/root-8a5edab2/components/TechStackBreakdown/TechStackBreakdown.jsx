"use client";

import { memo, useState } from "react";
import {
  Check,
  Search,
  Smartphone,
  Cloud,
  Palette,
  BrainCircuit,
  ArrowRight,
  X,
} from "lucide-react";
import "./TechStackBreakdown.css";

const STACK_ITEMS = [
  {
    id: "web-dev",
    step: "01",
    pill: "01 — Web Development",
    badgeColor: "#2563EB",
    badgeBg: "#EFF6FF",
    heading: "In Web Development We Use.",
    description:
      "We architect ultra-responsive, SEO-first web applications engineered for speed, conversion, and enterprise scale. From dynamic SPAs and SSR platforms to complete full-stack architectures.",
    bullets: [
      "Next.js 15 & React 19 server-side rendering for peak speed",
      "Type-safe full stack with TypeScript, Node.js & PostgreSQL",
      "Fluid 60fps animations with GSAP, Lenis & Tailwind CSS",
    ],
    buttonText: "Explore Web Stack",
    buttonIcon: Search,
    image: "/sites/apextechera-design-fc4b5892/root-8a5edab2/images/tech-breakdown/web-dev-stack.png",
    imageAlt: "In Web Development We Use",
  },
  {
    id: "app-dev",
    step: "02",
    pill: "02 — Mobile Apps",
    badgeColor: "#7C3AED",
    badgeBg: "#F3E8FF",
    heading: "In App Development We Use.",
    description:
      "We craft intuitive, fluid mobile applications for iOS and Android with true native speed, offline persistence, instant background push notifications, and seamless hardware integrations.",
    bullets: [
      "Cross-platform React Native & Expo unified codebases",
      "Fluid 120fps gesture animations with NativeWind & Reanimated",
      "Real-time data sync with Socket.IO, Supabase & Firebase",
    ],
    buttonText: "Explore Mobile Stack",
    buttonIcon: Smartphone,
    image: "/sites/apextechera-design-fc4b5892/root-8a5edab2/images/tech-breakdown/app-dev-stack.png",
    imageAlt: "In App Development We Use",
  },
  {
    id: "cloud-devops",
    step: "03",
    pill: "03 — Cloud & DevOps",
    badgeColor: "#059669",
    badgeBg: "#ECFDF5",
    heading: "In Cloud and DevOps We Use.",
    description:
      "We construct resilient, self-healing cloud infrastructure that scales effortlessly under high traffic with 99.99% uptime, zero-downtime CI/CD releases, and enterprise security.",
    bullets: [
      "Automated CI/CD deployment pipelines with GitHub Actions",
      "Containerization & orchestration with Docker and Kubernetes",
      "Edge caching, global CDN & DDoS shielding via Cloudflare & AWS",
    ],
    buttonText: "Explore Cloud Stack",
    buttonIcon: Cloud,
    image: "/sites/apextechera-design-fc4b5892/root-8a5edab2/images/tech-breakdown/cloud-devops-stack.png",
    imageAlt: "In Cloud and DevOps We Use",
  },
  {
    id: "uiux-design",
    step: "04",
    pill: "04 — UI/UX Design",
    badgeColor: "#DB2777",
    badgeBg: "#FDF2F8",
    heading: "In UI/UX Design We Use.",
    description:
      "We transform product visions into clean, conversion-focused user journeys with comprehensive atomic design systems and clickable high-fidelity prototypes crafted directly in Figma.",
    bullets: [
      "Atomic design systems & reusable component token libraries",
      "Interactive high-fidelity clickable prototypes for user testing",
      "Pixel-perfect responsive grids, micro-interactions & WCAG compliance",
    ],
    buttonText: "Explore UI/UX Stack",
    buttonIcon: Palette,
    image: "/sites/apextechera-design-fc4b5892/root-8a5edab2/images/tech-breakdown/uiux-figma-stack.png",
    imageAlt: "In UI/UX Design We Use",
  },
];

const TechStackBreakdown = memo(function TechStackBreakdown({ id }) {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <section
      id={id || "tech-breakdown"}
      className="tech-breakdown-wrapper"
    >
      <style>{`
        .tech-breakdown-wrapper {
          padding-top: 48px;
          padding-bottom: 48px;
          background-color: #FFFFFF;
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(226,232,240,0.8);
        }
        @media (max-width: 600px) {
          .tech-breakdown-wrapper { padding-top: 36px; padding-bottom: 36px; }
        }
        @media (min-width: 900px) {
          .tech-breakdown-wrapper { padding-top: 64px; padding-bottom: 64px; }
        }
        .tech-container {
          max-width: 1536px;
          margin: 0 auto;
          width: 100%;
          padding-left: 16px;
          padding-right: 16px;
        }
        @media (min-width: 600px) {
          .tech-container { padding-left: 32px; padding-right: 32px; }
        }
        @media (min-width: 900px) {
          .tech-container { padding-left: 48px; padding-right: 48px; }
        }
        .tech-step-title {
          font-size: 1.55rem;
          font-weight: 900;
          color: #0F172A;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-bottom: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        @media (min-width: 600px) { .tech-step-title { font-size: 2.5rem; } }
        @media (min-width: 900px) { .tech-step-title { font-size: 2.8rem; } }

        .tech-zig-col { display: flex; flex-direction: column; gap: 48px; }
        @media (min-width: 600px) { .tech-zig-col { gap: 80px; } }
        @media (min-width: 900px) { .tech-zig-col { gap: 0; } }

        .tech-zig-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: center;
          align-content: center;
          justify-items: center;
          direction: ltr;
        }
        @media (min-width: 1024px) {
          .tech-zig-row {
            grid-template-columns: 1fr 1.35fr;
            gap: 64px;
            min-height: 86vh;
            min-height: 86dvh;
            padding: 48px 0;
            align-content: center;
            justify-content: center;
          }
          .tech-zig-row.reversed { direction: rtl; }
          .tech-zig-row.reversed > div { direction: ltr; }
        }
        @media (min-width: 1536px) {
          .tech-zig-row { gap: 80px; min-height: 88vh; min-height: 88dvh; }
        }
        .tech-text-col {
          direction: ltr;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        @media (min-width: 1024px) {
          .tech-text-col { max-width: 520px; }
        }
        .tech-image-card {
          direction: ltr;
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(15,23,42,0.08), 0 4px 16px rgba(0,0,0,0.03);
          border: 1px solid rgba(226,232,240,0.9);
          background-color: #FFFFFF;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        @media (min-width: 600px) { .tech-image-card { border-radius: 24px; } }
        .tech-image-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 28px 64px rgba(15,23,42,0.12), 0 8px 24px rgba(0,0,0,0.04);
          border-color: rgba(37,99,235,0.3);
        }
        .tech-image-card img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.4s ease;
        }
        .tech-image-card:hover img { transform: scale(1.015); }
      `}</style>

      <div className="tech-container">
        <div className="tech-zig-col">
          {STACK_ITEMS.filter(item => item.id !== "ai-ml").map((item, idx) => {
            const isReversed = idx % 2 === 1;
            const BtnIcon = item.buttonIcon;
            return (
              <div
                key={item.id}
                className={`tech-zig-row ${isReversed ? "reversed" : ""}`}
              >
                <div className="tech-text-col">
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "4.8px 16px",
                      borderRadius: "20px",
                      backgroundColor: item.badgeBg,
                      color: item.badgeColor,
                      fontWeight: 800,
                      fontSize: "0.88rem",
                      letterSpacing: "0.02em",
                      marginBottom: "20px",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {item.pill}
                  </div>

                  <h3 className="tech-step-title">{item.heading}</h3>

                  <p
                    style={{
                      color: "#64748B",
                      fontSize: "1rem",
                      lineHeight: 1.65,
                      marginBottom: "28px",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    <span style={{ fontSize: "inherit" }} className="tech-desc-inner">{item.description}</span>
                    <style>{`@media(min-width:600px){ .tech-desc-inner{ font-size:1.1rem; } }`}</style>
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px", width: "100%" }}>
                    {item.bullets.map((feat, fIdx) => (
                      <div key={fIdx} style={{ display: "flex", alignItems: "center", gap: "9.6px" }}>
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            backgroundColor: item.badgeColor,
                            color: "#FFFFFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Check size={12} strokeWidth={3.5} />
                        </div>
                        <span
                          style={{
                            fontWeight: 600,
                            color: "#334155",
                            fontSize: "0.95rem",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#requestform"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      borderRadius: "24px",
                      padding: "9.6px 24px",
                      fontSize: "0.92rem",
                      fontWeight: 700,
                      backgroundColor: "#0F172A",
                      color: "#FFFFFF",
                      textDecoration: "none",
                      boxShadow: "0 4px 16px rgba(15,23,42,0.2)",
                      transition: "all 0.25s ease",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1E293B";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,23,42,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#0F172A";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,23,42,0.2)";
                    }}
                  >
                    <BtnIcon size={16} strokeWidth={2.2} />
                    <span>{item.buttonText}</span>
                    <ArrowRight size={16} strokeWidth={2.4} />
                  </a>
                </div>

                <div
                  className="tech-image-card"
                  onClick={() => setActiveImage(item.image)}
                >
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    width={1536}
                    height={1024}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>



      {activeImage && (
        <div
          className="tech-lightbox-overlay"
          onClick={() => setActiveImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(0,0,0,0.88)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <button
            onClick={() => setActiveImage(null)}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              zIndex: 50,
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
            }}
            aria-label="Close Preview"
          >
            <X size={24} />
          </button>
          <div
            style={{ position: "relative", maxWidth: "96vw", maxHeight: "94vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              alt="Tech Stack Enlarged Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "92vh",
                objectFit: "contain",
                borderRadius: "16px",
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
                display: "block",
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
});

export default TechStackBreakdown;

"use client";

import { memo, useState } from "react";
import { Check, BrainCircuit, ArrowRight, X } from "lucide-react";

const AI_DATA = {
  id: "ai-ml",
  pill: "05 — AI Models, Agents & Automation",
  heading: "In AI, Agents & Automation We Use.",
  description:
    "We empower businesses with cutting-edge AI solutions — custom AI/ML models, intelligent autonomous agents, robust workflow automations, RAG pipelines, and fine-tuned LLMs.",
  bullets: [
    "Custom AI/ML model development, fine-tuning & LLM integrations",
    "Autonomous multi-agent workflows using LangChain, LangGraph & CrewAI",
    "Powerful workflow automations, RAG pipelines & Vector DB search",
  ],
  buttonText: "Explore AI Stack",
  image: "/sites/apextechera-design-fc4b5892/root-8a5edab2/images/tech-breakdown/aiml-628.png",
  imageAlt: "In AI, Agents & Automation We Use",
};

const AISection = memo(function AISection({ id }) {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <>
      <section
        id={id || "ai-section"}
        style={{
          background: "linear-gradient(135deg, #0c0c1a 0%, #1a0a2e 40%, #0f172a 100%)",
          borderTop: "2px solid rgba(234,88,12,0.3)",
          padding: "80px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "700px", height: "450px",
          background: "radial-gradient(ellipse, rgba(234,88,12,0.18) 0%, rgba(168,85,247,0.1) 50%, transparent 75%)",
          filter: "blur(70px)", pointerEvents: "none", zIndex: 0,
        }} />

        <div style={{
          maxWidth: "1280px", margin: "0 auto",
          padding: "0 24px", position: "relative", zIndex: 1,
        }}>
          {/* Badge */}
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "7px 22px", borderRadius: "9999px",
              background: "rgba(234,88,12,0.15)", border: "1px solid rgba(234,88,12,0.4)",
              color: "#fb923c", fontWeight: 800, fontSize: "0.88rem",
              letterSpacing: "0.05em", fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              <BrainCircuit size={15} /> {AI_DATA.pill}
            </div>
          </div>

          {/* 2-col grid: text + image */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "48px",
            alignItems: "center",
          }}
            className="ai-section-grid"
          >
            <style>{`
              @media (min-width: 1024px) {
                .ai-section-grid { grid-template-columns: 1fr 1.35fr !important; gap: 80px !important; }
              }
              @media (min-width: 600px) {
                .ai-section-container-pad { padding: 0 32px !important; }
              }
              @media (min-width: 900px) {
                .ai-section-container-pad { padding: 0 48px !important; }
              }
            `}</style>

            {/* Text col */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <h2 style={{
                fontSize: "clamp(1.9rem, 3.5vw, 2.9rem)",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                marginBottom: "18px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                {AI_DATA.heading}
              </h2>

              <p style={{
                color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7,
                marginBottom: "32px", fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                {AI_DATA.description}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px", width: "100%" }}>
                {AI_DATA.bullets.map((feat, fIdx) => (
                  <div key={fIdx} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "22px", height: "22px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #ea580c, #f97316)",
                      color: "#fff", display: "flex", alignItems: "center",
                      justifyContent: "center", flexShrink: 0,
                      boxShadow: "0 0 14px rgba(234,88,12,0.45)",
                    }}>
                      <Check size={12} strokeWidth={3.5} />
                    </div>
                    <span style={{
                      fontWeight: 600, color: "#e2e8f0",
                      fontSize: "0.98rem", fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="#requestform"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  borderRadius: "24px", padding: "11px 30px",
                  fontSize: "0.95rem", fontWeight: 700,
                  background: "linear-gradient(135deg, #ea580c, #f97316)",
                  color: "#FFFFFF", textDecoration: "none",
                  boxShadow: "0 4px 22px rgba(234,88,12,0.45)",
                  transition: "all 0.25s ease",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(234,88,12,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 22px rgba(234,88,12,0.45)";
                }}
              >
                <BrainCircuit size={16} strokeWidth={2.2} />
                <span>{AI_DATA.buttonText}</span>
                <ArrowRight size={16} strokeWidth={2.4} />
              </a>
            </div>

            {/* Image col */}
            <div
              style={{
                borderRadius: "20px", overflow: "hidden",
                border: "1px solid rgba(234,88,12,0.25)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.55), 0 0 40px rgba(234,88,12,0.12)",
                cursor: "pointer", transition: "all 0.35s ease",
                background: "#0f172a",
              }}
              onClick={() => setActiveImage(AI_DATA.image)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 28px 70px rgba(0,0,0,0.65), 0 0 55px rgba(234,88,12,0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.55), 0 0 40px rgba(234,88,12,0.12)";
              }}
            >
              <img
                src={AI_DATA.image}
                alt={AI_DATA.imageAlt}
                width={1536}
                height={1024}
                style={{ width: "100%", height: "auto", display: "block", transition: "transform 0.4s ease" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
          }}
        >
          <button
            onClick={() => setActiveImage(null)}
            style={{
              position: "absolute", top: "24px", right: "24px", zIndex: 50,
              width: "48px", height: "48px", borderRadius: "50%",
              background: "rgba(255,255,255,0.2)", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "none", cursor: "pointer",
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
              alt="AI Stack Preview"
              style={{
                maxWidth: "100%", maxHeight: "92vh", objectFit: "contain",
                borderRadius: "16px", boxShadow: "0 25px 60px rgba(0,0,0,0.5)", display: "block",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
});

export default AISection;

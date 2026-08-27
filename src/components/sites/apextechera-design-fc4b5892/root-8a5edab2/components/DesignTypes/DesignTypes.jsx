import React, { memo } from "react";
import { 
  Sparkles, 
  Box, 
  Film, 
  Compass, 
  Layers, 
  Zap 
} from "lucide-react";
import "./DesignTypes.css";

const DESIGN_CARDS = [
  {
    num: "01",
    icon: Sparkles,
    title: "Modern / Minimal Website",
    desc: "Clean, simple UI with focused whitespace, sharp typography, and effortless friction-free navigation.",
  },
  {
    num: "02",
    icon: Box,
    title: "3D Website",
    desc: "3D models, depth perception, spatial lighting, and interactive tactile objects that deeply engage users.",
  },
  {
    num: "03",
    icon: Film,
    title: "Motion Graphics Website",
    desc: "Silky animations, micro-interactions, fluid transitions, and cinematic moving visuals.",
  },
  {
    num: "04",
    icon: Compass,
    title: "Creative / Experimental Website",
    desc: "Unique bespoke layouts, kinetic typography, expressive art direction, and delightfully unusual interactions.",
  },
  {
    num: "05",
    icon: Layers,
    title: "Glassmorphism / Futuristic Website",
    desc: "Multi-layered blur, frosted glass cards, radiant neon effects, and futuristic aesthetic depth.",
  },
  {
    num: "06",
    icon: Zap,
    title: "Immersive / Interactive Website",
    desc: "Scroll-linked animations, WebGL custom shaders, gyro parallax depth, and captivating interactive scenes.",
  },
];

const DesignTypes = memo(function DesignTypes({ id }) {
  return (
    <section id={id} className="design-types-section">
      {/* Ambient background glow & mesh */}
      <div className="dt-bg-glow" />
      <div className="dt-grid-mesh" />

      <div className="dt-wrapper">
        {/* Section Header */}
        <div className="dt-header">
          <div className="dt-pill">
            <span className="dt-pill-dot" />
            <span>WHAT WE CRAFT</span>
          </div>
          <h2 className="dt-title">
            Types of Design <span className="dt-title-highlight">We Create</span>
          </h2>
          <p className="dt-subtitle">
            From clean minimalist interfaces to cutting-edge 3D WebGL experiences — engineered to elevate brands and captivate users.
          </p>
        </div>

        {/* 6-Card Interactive Luxury Grid */}
        <div className="dt-cards-grid">
          {DESIGN_CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="dt-card">
                <div className="dt-card-top">
                  <div className="dt-icon-wrap">
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <span className="dt-card-num">{card.num}</span>
                </div>
                <h3 className="dt-card-name">{card.title}</h3>
                <p className="dt-card-desc">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default DesignTypes;

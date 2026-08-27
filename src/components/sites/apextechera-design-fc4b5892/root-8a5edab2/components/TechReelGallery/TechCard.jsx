"use client";
import React, { useState } from "react";

function hashColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return `hsl(${h} 70% 94%)`;
}
function hashTextColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return `hsl(${h} 45% 28%)`;
}

export default function TechCard({ tech, rowHeight = 92 }) {
  const [imgError, setImgError] = useState(false);
  const size = rowHeight - 8; // square logo card
  const isFallback = imgError || !tech.icon;

  return (
    <div
      className="tech-card group relative shrink-0 flex items-center justify-center rounded-[12px] border shadow-[0_2px_10px_rgba(0,0,0,0.06)] select-none cursor-pointer overflow-hidden"
      style={{
        height: size,
        width: size,
        borderRadius: 12,
        background: isFallback ? hashColor(tech.name) : "#fff",
        borderColor: isFallback ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.08)",
        transition: "transform 0.35s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        filter: "none",
        imageRendering: "auto",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px) scale(1.04)";
        e.currentTarget.style.borderColor = "rgba(0,0,0,0.14)";
        e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.14)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)";
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)";
      }}
      title={tech.name}
    >
      {!imgError && tech.icon ? (
        <img
          src={tech.icon}
          alt={tech.name}
          className="w-[58%] h-[58%] object-contain"
          draggable={false}
          loading="lazy"
          style={{ imageRendering: "auto", filter: "none" }}
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className="text-[11px] font-bold tracking-widest"
          style={{ color: hashTextColor(tech.name) }}
        >
          {tech.name.slice(0, 4).toUpperCase()}
        </span>
      )}
    </div>
  );
}

"use client";
import React from "react";

export default function MarqueeCard({ project }) {
  const poster = project.poster
    ? `/sites/apextechera-design-fc4b5892/root-8a5edab2/projects/${project.poster}`
    : null;

  const hasLiveLink = Boolean(
    project.link &&
    project.link.trim() !== "" &&
    project.link !== "#" &&
    project.link !== "null" &&
    project.link !== "undefined"
  );

  const titleString = Array.isArray(project.title)
    ? project.title.join(" • ")
    : (project.title || project.titleUp || "Project");

  const isDark = project.theme === "dark";

  return (
    <div
      onClick={hasLiveLink ? () => window.open(project.link, "_blank") : undefined}
      className={`marquee-card group relative shrink-0 h-[190px] sm:h-[230px] md:h-[265px] lg:h-[285px] rounded-2xl overflow-hidden ${
        isDark ? "bg-[#0c0c10] border-white/15" : "bg-[#f4f4f7] border-black/10"
      } border select-none shadow-2xl flex flex-col justify-end ${
        hasLiveLink ? "cursor-pointer" : "cursor-default"
      }`}
      style={{ width: "max-content", minWidth: "285px" }}
    >
      {/* 100% natural image dimensions - zero cropping on left, right, top, or bottom */}
      {poster ? (
        <img
          src={poster}
          alt={titleString}
          draggable={false}
          className="h-full w-auto max-w-[560px] object-contain opacity-100 group-hover:scale-[1.02] transition-transform duration-500 ease-out pointer-events-none block"
        />
      ) : (
        <div className="w-[390px] h-full bg-gradient-to-br from-zinc-800 to-neutral-900" />
      )}

      {/* Floating Info Pill - lifted with left-4 bottom-4 and inner padding so text NEVER clips */}
      <div className="absolute left-3.5 sm:left-4 bottom-3.5 sm:bottom-4 z-10 max-w-[85%] pointer-events-auto">
        <div
          className={`backdrop-blur-md px-4 py-2 rounded-xl border shadow-xl ${
            isDark
              ? "bg-[#0c0c12]/92 border-white/20"
              : "bg-white/95 border-black/10"
          }`}
        >
          {Array.isArray(project.title) ? (
            <div>
              <p
                className={`text-[13px] sm:text-[14px] md:text-[15px] font-extrabold leading-tight tracking-tight whitespace-nowrap ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                {project.title[0]}
              </p>
              {project.title[1] && (
                <p
                  className={`text-[11px] sm:text-[12px] font-semibold mt-0.5 tracking-normal whitespace-nowrap ${
                    isDark ? "text-white/80" : "text-zinc-700"
                  }`}
                >
                  {project.title[1]}
                </p>
              )}
            </div>
          ) : (
            <p
              className={`text-[13px] sm:text-[14px] md:text-[15px] font-extrabold leading-tight tracking-tight whitespace-nowrap ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {titleString}
            </p>
          )}
        </div>
      </div>

      {/* Live link button on bottom right */}
      {hasLiveLink && (
        <div className="absolute right-3.5 sm:right-4 bottom-3.5 sm:bottom-4 z-10 pointer-events-auto">
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] tracking-wider uppercase text-emerald-300 font-semibold px-2.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 shadow-xl group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-400 transition-all duration-300">
            Live Demo <span className="text-xs leading-none">↗</span>
          </span>
        </div>
      )}

      {/* hover border glow */}
      <div
        className={`absolute inset-0 rounded-2xl border pointer-events-none transition-colors duration-300 ${
          hasLiveLink
            ? "border-transparent group-hover:border-emerald-500/60"
            : isDark
            ? "border-white/10"
            : "border-black/5"
        }`}
      />
    </div>
  );
}

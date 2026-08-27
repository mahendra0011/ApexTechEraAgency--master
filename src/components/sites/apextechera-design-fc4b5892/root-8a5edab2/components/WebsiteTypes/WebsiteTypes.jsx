import React, { memo } from "react";
import "./WebsiteTypes.css";

const WEBSITE_TYPES = [
  "Business / Corporate Website",
  "Portfolio Website",
  "E-commerce Website",
  "Blog Website",
  "Landing Page",
  "SaaS Website",
  "Web App / Dashboard",
  "Educational Website",
  "News / Magazine Website",
  "Social Media Website",
  "Entertainment Website",
  "Booking Website",
  "Marketplace",
  "Documentation Website",
  "Community / Forum Website",
];

const WebsiteTypes = memo(function WebsiteTypes({ id }) {
  return (
    <section id={id} className="wt-section">
      {/* Background ambient lighting */}
      <div className="wt-bg-glow" />
      <div className="wt-grid-mesh" />

      <div className="wt-wrapper">
        {/* Section Header */}
        <div className="wt-header">
          <div className="wt-pill">
            <span className="wt-pill-dot" />
            <span>15+ SPECIALIZED CATEGORIES</span>
          </div>
          <h2 className="wt-main-title">
            Explore <span className="wt-title-highlight">Website Types</span>
          </h2>
          <p className="wt-subtitle">
            15+ Website Categories for Every Digital Need — Tailored for conversion, scalability, and impact.
          </p>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="wt-grid">
          {/* LEFT: Image Showcase */}
          <div className="wt-left-col">
            <div className="wt-image-wrapper">
              <img
                src="/sites/apextechera-design-fc4b5892/root-8a5edab2/images/categories-showcase.png"
                alt="Explore Website Types Showcase"
                className="wt-image"
              />
              <div className="wt-image-badge">
                <span className="wt-badge-dot" />
                <span>ApexTechEra Full-Stack Architecture</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Clean Flowing Category Pills */}
          <div className="wt-right-col">
            <div className="wt-content-box">
              <h3 className="wt-box-heading">Categories We Specialize In</h3>
              <div className="wt-pills-cloud">
                {WEBSITE_TYPES.map((type, index) => (
                  <div key={index} className="wt-cloud-pill">
                    <span className="wt-pill-index">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                    <span className="wt-pill-title">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default WebsiteTypes;

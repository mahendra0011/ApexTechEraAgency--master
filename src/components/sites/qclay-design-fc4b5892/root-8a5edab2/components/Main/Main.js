import React, { useRef, memo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import './McodeHero.css';

const Main = memo(function Main() {
  const parentRef = useRef(null);

  return (
    <div className="mcode-hero-root" ref={parentRef} id="home">
      {/* Isometric Landscape Hero Background */}
      <div 
        className="mcode-hero-bg" 
        style={{ 
          backgroundImage: `url(/sites/qclay-design-fc4b5892/root-8a5edab2/images/main/hero-bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
        aria-hidden="true"
      />

      <div className="mcode-hero-container">
        {/* Top Badge */}
        <div className="mcode-badge">
          <span className="mcode-badge-title">ApexTechEra</span>
          <span className="mcode-badge-star">✦</span>
          <span className="mcode-badge-services">Full-Stack Web Development • Android/iOS App • UI/UX • Software Development • AI/ML</span>
        </div>

        {/* Big Headline - 3 Lines */}
        <h1 className="mcode-headline">
          <span className="block">We Build</span>
          <span className="block">Digital Products That Move</span>
          <span className="block">
            <span className="mcode-terminal-pill">
              Businesses Forward.
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mcode-subtitle">
          ApexTechEra is a full-service technology agency building modern websites, web &amp; mobile apps, intuitive UI/UX experiences, and intelligent AI/ML solutions crafted to launch, grow, and scale your business.
        </p>

        {/* Action Buttons */}
        <div className="mcode-actions">
          <a href="#contact" className="mcode-btn-primary">
            <span className="mcode-btn-primary-text">Build With Us</span>
            <span className="mcode-btn-primary-arrow">
              <ArrowUpRight size={20} />
            </span>
          </a>

          <a href="#portfolio" className="mcode-btn-secondary">
            <span>View Our Work</span>
          </a>
        </div>

        {/* Video Window Preview */}
        <div className="mcode-terminal-wrapper">
          <div className="mcode-terminal-window">
            {/* Window Header */}
            <div className="mcode-terminal-header">
              <div className="mcode-traffic-lights">
                <span className="traffic-dot dot-red" />
                <span className="traffic-dot dot-yellow" />
                <span className="traffic-dot dot-green" />
              </div>
              <div className="mcode-terminal-title">Tech-agency — showcase</div>
            </div>

            {/* Video Player Body */}
            <div className="mcode-terminal-video-wrap">
              <video
                src="/sites/qclay-design-fc4b5892/root-8a5edab2/video/tech-agency-logo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="mcode-terminal-video"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Main;

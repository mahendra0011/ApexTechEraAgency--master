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
          backgroundImage: `url(/images/hero-bg.png)`,
          backgroundSize: 'contain',
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
      </div>
    </div>
  );
});

export default Main;

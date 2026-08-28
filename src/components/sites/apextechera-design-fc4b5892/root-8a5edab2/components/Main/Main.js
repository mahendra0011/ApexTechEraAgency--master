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
        }}
        aria-hidden="true"
      />

      <div className="mcode-hero-container">
        {/* Top Badge */}
        <div className="mcode-badge">
          <span className="mcode-badge-title">ApexTechEra Agency</span>
          <span className="mcode-badge-star">✦</span>
          <span className="mcode-badge-services">Full-Stack Web Development • Android/iOS App • UI/UX • Software Development • AI/ML Models • AI Agents • AI Automations</span>
        </div>

        {/* Big Headline - 3 Lines */}
        <h1 className="mcode-headline">
          <span className="block">We Build</span>
          <span className="block">Digital Products That Move</span>
          <span className="block">
            <span className="mcode-terminal-pill">
              Businesses Forward.
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mcode-growth-svg" aria-label="Growth">
                <path d="M22 7L13.5 15.5L8.5 10.5L2 17" stroke="#16a34a" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="mcode-growth-path" />
                <path d="M16 7H22V13" stroke="#16a34a" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="mcode-growth-arrow" />
              </svg>
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mcode-subtitle">
          ApexTechEra Agency is a full-service technology agency building modern websites, web &amp; mobile applications, intuitive UI/UX experiences, custom software development, AI/ML models, intelligent AI agents, and powerful AI automation solutions—crafted to launch, grow, and scale your business.
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

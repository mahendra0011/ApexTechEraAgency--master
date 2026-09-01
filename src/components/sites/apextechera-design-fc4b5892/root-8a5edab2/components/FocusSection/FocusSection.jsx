import { memo, useRef, useState, useEffect } from "react";
import { useTransform } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Controller/hooks/useTransform/index";
import { screens } from "../../constants";
import { getElementCoords, getScrollCoordsFromElement } from "../../../../../../lib/sites/apextechera-design-fc4b5892/Animator/js/coords/index";
import "./FocusSection.css";

const FOCUS_CARDS_DATA = [
  {
    id: "01",
    color: "#F6E7E5",
    image: "/sites/apextechera-design-fc4b5892/root-8a5edab2/images/quality2.png",
    word1: "High",
    word2: "Quality",
    desc: "Every pixel, animation, and backend service is crafted to international standards with clean, maintainable architecture.",
  },
  {
    id: "02",
    color: "#DDF3EB",
    image: "/sites/apextechera-design-fc4b5892/root-8a5edab2/images/perfomance2.png",
    word1: "Peak",
    word2: "Performance",
    desc: "Lightning-fast page loads, sub-second API responses, and buttery smooth 60fps animations engineered for conversion.",
  },
  {
    id: "03",
    color: "#EBE9F5",
    image: "/sites/apextechera-design-fc4b5892/root-8a5edab2/images/affordablity2.png",
    word1: "Honest",
    word2: "Affordability",
    desc: "Enterprise-grade solutions without the enterprise price tag — transparent pricing, zero hidden costs.",
  },
  {
    id: "04",
    color: "#EFF3DC",
    image: "/sites/apextechera-design-fc4b5892/root-8a5edab2/images/secuarity2.png",
    word1: "Bulletproof",
    word2: "Security",
    desc: "Enterprise-grade encryption, secure authentication, OWASP compliance, and proactive vulnerability testing.",
  },
  {
    id: "05",
    color: "#E0F2FE",
    image: "/sites/apextechera-design-fc4b5892/root-8a5edab2/images/fast-delivery.png",
    word1: "Fast",
    word2: "Delivery",
    desc: "Rapid sprint turnaround, agile iterations, and punctual on-time launches designed to accelerate your go-to-market speed.",
  },
];

const INDUSTRIES_DATA = [
  {
    title: "E-commerce & Retail",
    subtitle: "Modern Storefronts & Omnichannel Commerce",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    link: "#portfolio",
  },
  {
    title: "Healthcare & MedTech",
    subtitle: "Telehealth, EHR & Patient Care Portals",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
    link: "#portfolio",
  },
  {
    title: "FinTech & Banking",
    subtitle: "Trading Platforms & Secure Digital Banking",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop",
    link: "#portfolio",
  },
  {
    title: "EdTech & E-learning",
    subtitle: "Interactive LMS & Virtual Learning Suites",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop",
    link: "#portfolio",
  },
  {
    title: "Real Estate & PropTech",
    subtitle: "3D Virtual Tours & Property Marketplaces",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop",
    link: "#portfolio",
  },
  {
    title: "Logistics & Supply Chain",
    subtitle: "Fleet Telematics & Warehouse Optimization",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop",
    link: "#portfolio",
  },
];

const FocusCardItem = memo(function FocusCardItem({ item, index }) {
  const { parent, target } = useTransform(
    { onChange: handler, onResize: handler },
    { id: screens.FOCUS }
  );
  const cardRef = useRef(null);

  function handler({ parent: p, target: t }) {
    if (!cardRef.current || !p || !t) return;
    if (window.innerWidth > 576) {
      const distance = getElementCoords(p).width - getElementCoords(t).width;
      const scrollX =
        distance +
        getScrollCoordsFromElement(cardRef.current).windowRight.fromRight -
        60 -
        (window.innerWidth / window.innerHeight) * 100 * (4 - index);
      const x = Math.max(Math.min(scrollX, distance), 0);
      t.style.transform = `translate3d(${x}px, 0, 0)`;
    } else {
      const distance = getElementCoords(p).width - getElementCoords(t).width;
      const coef = index === 0 ? 4 : index === 1 ? 6 : 15;
      const scrollX =
        getScrollCoordsFromElement(cardRef.current).windowBottom.fromBottom -
        window.innerHeight / coef;
      const x = Math.max(Math.min(scrollX, distance), 0);
      t.style.transform = `translate3d(${x}px, 0, 0)`;
    }
  }

  return (
    <div
      ref={cardRef}
      className={`focus-card-item focus-card-item--${item.id}`}
      style={{ backgroundColor: item.color }}
    >
      <div className="focus-card__rings">
        <div className="focus-card__ring focus-card__ring-1" />
        <div className="focus-card__ring focus-card__ring-2" />
        <div className="focus-card__ring focus-card__ring-3" />
      </div>

      <div ref={parent} className="focus-card__media">
        <div ref={target} className="focus-card__image-wrap">
          <img
            src={item.image}
            alt={`${item.word1} ${item.word2}`}
            className={`focus-card__img focus-card__img--${item.id}`}
          />
        </div>
      </div>

      <div className="focus-card__content">
        <div className="focus-card__header">
          <span className="focus-card__index">{item.id}</span>
        </div>

        <div className="focus-card__body">
          <h3 className="focus-card__title">
            <span className="focus-card__title-word1">{item.word1}</span>
            <span className="focus-card__title-word2">{item.word2}</span>
          </h3>
          <p className="focus-card__desc">{item.desc}</p>
        </div>

        <div className="focus-card__footer">
          <span className="focus-card__arrow">&#8599;</span>
        </div>
      </div>
    </div>
  );
});

const FocusSection = memo(function FocusSection() {
  const { parent, target } = useTransform("horizontalScroll", {
    id: screens.FOCUS,
    minWidth: 576,
  });

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [industriesRevealed, setIndustriesRevealed] = useState(false);
  const [quoteProgress, setQuoteProgress] = useState(0);

  const industriesRef = useRef(null);
  const quoteRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Scroll reveal for Industries section
  useEffect(() => {
    if (!industriesRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIndustriesRevealed(true);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(industriesRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll scrub for Quote section
  useEffect(() => {
    const handleScroll = () => {
      if (!quoteRef.current) return;
      const rect = quoteRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const start = windowH * 0.9;
      const end = windowH * 0.1;
      const p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setQuoteProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLineStyle = (lineIndex, totalLines = 4) => {
    const step = 0.85 / totalLines;
    const lineStart = lineIndex * step * 0.65;
    const lineEnd = lineStart + step;
    const p = Math.max(0, Math.min(1, (quoteProgress - lineStart) / (lineEnd - lineStart)));

    return {
      opacity: 0.2 + 0.8 * p,
      transform: `translateY(${(1 - p) * 18}px)`,
      filter: `blur(${(1 - p) * 4}px)`,
      transition: "opacity 0.2s ease-out, transform 0.2s ease-out, filter 0.2s ease-out",
    };
  };

  return (
    <div className="focus-section" id="focus">
      {/* 1. HORIZONTAL 4 CARDS (Left Image, Right Text) */}
      <div ref={parent} className="focus-cards-scroll-wrap">
        <div ref={target} className="focus-cards-scroll">
          <div className="focus-cards-container">
            {FOCUS_CARDS_DATA.map((item, i) => (
              <FocusCardItem key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* 2. INDUSTRIES WE SERVE LIST COMPONENT */}
      <div
        ref={industriesRef}
        className={`focus-disciplines-section ${industriesRevealed ? "is-revealed" : ""}`}
        onMouseMove={handleMouseMove}
      >
        <div className="focus-disciplines-header">
          <span className="focus-disciplines-tag">EXPERTISE & VERTICALS</span>
          <h2 className="focus-disciplines-heading">Industries We Serve</h2>
        </div>
        <div className="focus-disciplines-list">
          {INDUSTRIES_DATA.map((d, i) => (
            <a
              key={i}
              href={d.link}
              className="focus-discipline-item"
              style={{
                transitionDelay: `${0.1 + i * 0.08}s`,
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="focus-discipline-title">{d.title}</span>
              <span className="focus-discipline-badge">
                <span>OPEN</span>
                <span className="dot" />
              </span>
              <span className="focus-discipline-arrow">&#8599;</span>
            </a>
          ))}
        </div>

        {/* Floating Hover Card Preview */}
        <div
          className={`focus-hover-preview ${hoveredIndex !== null ? "is-visible" : ""}`}
          style={{
            transform: `translate3d(${cursorPos.x + 24}px, ${cursorPos.y - 120}px, 0)`,
          }}
        >
          {hoveredIndex !== null && (
            <div className="focus-hover-card">
              <div className="focus-hover-card-img-wrap">
                <img
                  src={INDUSTRIES_DATA[hoveredIndex].image}
                  alt={INDUSTRIES_DATA[hoveredIndex].title}
                  className="focus-hover-card-img"
                />
              </div>
              <div className="focus-hover-card-info">
                <span className="focus-hover-card-title">
                  {INDUSTRIES_DATA[hoveredIndex].title}
                </span>
                <span className="focus-hover-card-subtitle">
                  {INDUSTRIES_DATA[hoveredIndex].subtitle}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. OVAL STUDIO BANNER + QUOTE */}
      <div className="focus-banner-quote-section">
        <div className="focus-banner-oval-wrap">
          <img
            src="/sites/apextechera-design-fc4b5892/root-8a5edab2/images/bannertrans.png"
            alt="ApexTechEra Studio"
            className="focus-banner-oval-img"
          />
        </div>
        <div ref={quoteRef} className="focus-quote-wrap">
          <h3 className="focus-quote-text">
            <span className="focus-quote-line" style={getLineStyle(0)}>
              At ApextechEra, we transform bold ideas
            </span>
            <span className="focus-quote-line" style={getLineStyle(1)}>
              into immersive digital experiences
            </span>
            <span className="focus-quote-line" style={getLineStyle(2)}>
              through good design and relentless
            </span>
            <span className="focus-quote-line" style={getLineStyle(3)}>
              creativity.
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
});

export default FocusSection;

import React, { useRef, useEffect } from 'react';
import './ScrollExpand.css';

const ScrollExpand = ({
  src,
  alt = 'Product hero',
  title = 'Built to scale',
  scrollHint = 'Scroll to expand',
  mediaZoom = 1.25,
  children,
  className = '',
  style = {},
  targetRef,
  parentRef,
}) => {
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const mediaRef = useRef(null);
  const badgeRef = useRef(null);
  const contentRef = useRef(null);
  const hintRef = useRef(null);
  const overlayRef = useRef(null);

  const isVideo = src && (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.ogg') || src.includes('/video/'));

  useEffect(() => {
    const parentEl = parentRef?.current || containerRef.current?.closest('.main') || document.getElementById('home') || document.body;
    const frameEl = targetRef?.current || frameRef.current;
    const mediaEl = mediaRef.current;
    const badgeEl = badgeRef.current;
    const contentEl = contentRef.current;
    const hintEl = hintRef.current;
    const overlayEl = overlayRef.current;

    const onWheelUpdate = (e) => {
      if (!frameEl || !parentEl) return;
      const wheel = e.detail?.wheel || 0;
      const height = parentEl.getBoundingClientRect().height || window.innerHeight * 2;
      const scrollableDist = Math.max(1, height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, wheel / scrollableDist));

      // 1. Scale and Expand Frame
      const minScale = window.innerWidth <= 576 ? 1 : 0.82;
      const currentScale = minScale + (1 - minScale) * progress;
      frameEl.style.transform = `scale(${currentScale})`;

      // 2. Border Radius Transition (28px down to 0px)
      const radius = Math.max(0, 28 * (1 - progress * 1.15));
      frameEl.style.borderRadius = `${radius}px`;

      // 3. Media Zoom / Parallax
      if (mediaEl) {
        const zoom = 1 + (mediaZoom - 1) * progress;
        mediaEl.style.transform = `scale(${zoom})`;
      }

      // 4. Text & Badges Fade out and Slide up
      const textOpacity = Math.max(0, 1 - progress * 2.2);
      const textTransY = `-${progress * 50}px`;

      if (badgeEl) {
        badgeEl.style.opacity = textOpacity;
        badgeEl.style.transform = `translateY(${textTransY})`;
      }
      if (contentEl) {
        contentEl.style.opacity = textOpacity;
        contentEl.style.transform = `translateY(${textTransY})`;
      }
      if (hintEl) {
        hintEl.style.opacity = textOpacity;
        hintEl.style.transform = `translateY(${textTransY})`;
      }
      if (overlayEl) {
        overlayEl.style.opacity = textOpacity;
      }
    };

    document.addEventListener('customwheel', onWheelUpdate);
    document.addEventListener('triggerwheel', onWheelUpdate);

    // Initial render
    onWheelUpdate({ detail: { wheel: 0 } });

    return () => {
      document.removeEventListener('customwheel', onWheelUpdate);
      document.removeEventListener('triggerwheel', onWheelUpdate);
    };
  }, [parentRef, targetRef, mediaZoom]);

  return (
    <div 
      ref={containerRef}
      className={`scroll-expand-container ${className}`}
      style={{ ...style }}
    >
      <div 
        ref={(el) => {
          frameRef.current = el;
          if (targetRef) targetRef.current = el;
        }}
        className="scroll-expand-frame"
      >
        {/* Media (Video or Image) */}
        <div className="scroll-expand-media-wrap">
          {isVideo ? (
            <video
              ref={mediaRef}
              src={src}
              autoPlay
              loop
              muted
              playsInline
              className="scroll-expand-media"
            />
          ) : (
            <img
              ref={mediaRef}
              src={src}
              alt={alt}
              className="scroll-expand-media"
            />
          )}
          <div ref={overlayRef} className="scroll-expand-overlay" />
        </div>

        {/* Floating Top Badge */}
        {title && (
          <div ref={badgeRef} className="scroll-expand-badge">
            <span className="scroll-expand-badge-dot" />
            <span className="scroll-expand-badge-text">{title}</span>
          </div>
        )}

        {/* Content (h2, p, etc.) */}
        {children && (
          <div ref={contentRef} className="scroll-expand-content">
            {children}
          </div>
        )}

        {/* Scroll Hint */}
        {scrollHint && (
          <div ref={hintRef} className="scroll-expand-hint">
            <span className="scroll-expand-hint-text">{scrollHint}</span>
            <div className="scroll-expand-hint-arrow">↓</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrollExpand;

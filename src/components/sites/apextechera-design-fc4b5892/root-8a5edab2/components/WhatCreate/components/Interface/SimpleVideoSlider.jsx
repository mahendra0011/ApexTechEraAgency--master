import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import gsap from 'gsap'

const SLIDE_DURATION = 0.7

const SimpleVideoSlider = forwardRef(function SimpleVideoSlider(
  { items, startIndex = 0, onIndexChange, onClose, initialTime = 0 },
  ref
) {
  const slidesRef = useRef([])
  const currentIndexRef = useRef(startIndex)
  const isAnimatingRef = useRef(false)
  const [index, setIndex] = useState(startIndex)

  // Touch gesture state for mobile swiping
  const touchStartXRef = useRef(0)
  const touchStartYRef = useRef(0)
  const touchStartTimeRef = useRef(0)

  const onIndexChangeRef = useRef(onIndexChange)
  useEffect(() => { onIndexChangeRef.current = onIndexChange }, [onIndexChange])

  // Setup initial slide positions and visibility
  useEffect(() => {
    currentIndexRef.current = startIndex
    setIndex(startIndex)
    onIndexChangeRef.current?.(startIndex)
    
    const els = slidesRef.current.filter(Boolean)
    els.forEach((el, i) => {
      gsap.killTweensOf(el)
      if (i === startIndex) {
        gsap.set(el, { xPercent: 0, zIndex: 2, visibility: 'visible', opacity: 1 })
        try {
          const p = el.play()
          if (p && p.catch) { p.catch(() => {}) }
        } catch (e) {}
      } else {
        gsap.set(el, { xPercent: i > startIndex ? 100 : -100, zIndex: 0, visibility: 'hidden', opacity: 1 })
      }
    })

    return () => {
      const live = slidesRef.current.filter(Boolean)
      gsap.killTweensOf(live)
    }
  }, [startIndex])

  // Start all videos playing so there is zero black frame delay on slide switch
  useEffect(() => {
    slidesRef.current.filter(Boolean).forEach((el) => {
      try {
        const p = el.play()
        if (p && p.catch) { p.catch(() => {}) }
      } catch (e) {}
    })
  }, [])

  const gotoSlide = (nextIndex, explicitDirection) => {
    if (nextIndex < 0 || nextIndex >= items.length) { return }
    if (nextIndex === currentIndexRef.current) { return }

    const prevIndex = currentIndexRef.current
    const direction = explicitDirection !== undefined ? explicitDirection : (nextIndex > prevIndex ? 1 : -1)
    const currentSlide = slidesRef.current[prevIndex]
    const nextSlide = slidesRef.current[nextIndex]
    if (!currentSlide || !nextSlide) { return }

    // Commit index update immediately so dots transition in sync
    currentIndexRef.current = nextIndex
    setIndex(nextIndex)
    onIndexChangeRef.current?.(nextIndex)

    // Ensure next video is playing
    nextSlide.style.visibility = 'visible'
    if (nextSlide.paused) {
      try { const p = nextSlide.play(); if (p && p.catch) { p.catch(() => {}) } } catch (e) {}
    }

    isAnimatingRef.current = true

    // Clear previous tweens and set initial z-index / position
    const allSlides = slidesRef.current.filter(Boolean)
    gsap.killTweensOf(allSlides)

    allSlides.forEach((el, idx) => {
      if (idx !== prevIndex && idx !== nextIndex) {
        gsap.set(el, { zIndex: 0, visibility: 'hidden', xPercent: idx > nextIndex ? 100 : -100 })
      }
    })

    gsap.set(currentSlide, { zIndex: 1, visibility: 'visible' })
    gsap.set(nextSlide, { 
      xPercent: direction === 1 ? 100 : -100, 
      zIndex: 2, 
      visibility: 'visible' 
    })

    const outTarget = direction === 1 ? -100 : 100

    gsap.to(currentSlide, {
      xPercent: outTarget,
      duration: SLIDE_DURATION,
      ease: 'power2.inOut'
    })

    gsap.to(nextSlide, {
      xPercent: 0,
      duration: SLIDE_DURATION,
      ease: 'power2.inOut',
      onComplete: () => {
        allSlides.forEach((el, i) => {
          if (i === nextIndex) {
            gsap.set(el, { xPercent: 0, zIndex: 2, visibility: 'visible' })
          } else {
            gsap.set(el, { xPercent: i > nextIndex ? 100 : -100, zIndex: 0, visibility: 'hidden' })
          }
        })
        isAnimatingRef.current = false
      }
    })
  }

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length !== 1) return
    touchStartXRef.current = e.touches[0].clientX
    touchStartYRef.current = e.touches[0].clientY
    touchStartTimeRef.current = Date.now()
  }

  const handleTouchEnd = (e) => {
    if (!e.changedTouches || e.changedTouches.length !== 1) return
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const diffX = touchEndX - touchStartXRef.current
    const diffY = touchEndY - touchStartYRef.current
    const diffTime = Date.now() - touchStartTimeRef.current

    // Quick swipe or drag distance threshold
    const minSwipeDist = 35
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDist) {
      if (diffX < 0) {
        // Swiped Left -> Go Next Slide
        if (currentIndexRef.current < items.length - 1) {
          gotoSlide(currentIndexRef.current + 1, 1)
        }
      } else {
        // Swiped Right -> Go Previous Slide
        if (currentIndexRef.current > 0) {
          gotoSlide(currentIndexRef.current - 1, -1)
        }
      }
    } else if (Math.abs(diffY) > 70 && Math.abs(diffY) > Math.abs(diffX)) {
      // Large vertical swipe down to dismiss/exit on mobile
      if (diffY > 0 && typeof onClose === 'function') {
        onClose()
      }
    }
  }

  useImperativeHandle(ref, () => ({
    next: () => {
      if (currentIndexRef.current < items.length - 1) {
        gotoSlide(currentIndexRef.current + 1, 1)
        return true
      }
      return false
    },
    prev: () => {
      if (currentIndexRef.current > 0) {
        gotoSlide(currentIndexRef.current - 1, -1)
        return true
      }
      return false
    },
    goTo: (idx) => {
      gotoSlide(idx)
    },
    currentIndex: () => currentIndexRef.current,
    isAnimating: () => isAnimatingRef.current
  }))

  return (
    <div 
      className="apex-simple-slider"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {items.map((item, i) => (
        <video
          key={item.video}
          ref={(el) => (slidesRef.current[i] = el)}
          className="apex-simple-slider__video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={item.video} type="video/mp4" />
        </video>
      ))}

      {/* Top Right Close Button for Mobile & Desktop */}
      {onClose && (
        <button
          type="button"
          className="apex-simple-slider__close-btn"
          onClick={onClose}
          aria-label="Close fullscreen slider"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      {/* Top Mobile Slide Counter Pill */}
      <div className="apex-simple-slider__counter">
        <span>{index + 1}</span> / <span>{items.length}</span>
      </div>

      {/* Prev / Next Clickable Navigation Arrows */}
      {index > 0 && (
        <button
          type="button"
          className="apex-simple-slider__nav-btn apex-simple-slider__nav-btn--prev"
          onClick={() => gotoSlide(index - 1, -1)}
          aria-label="Previous service video"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {index < items.length - 1 && (
        <button
          type="button"
          className="apex-simple-slider__nav-btn apex-simple-slider__nav-btn--next"
          onClick={() => gotoSlide(index + 1, 1)}
          aria-label="Next service video"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Center Caption Pill for Service Title */}
      <div className="apex-simple-slider__caption-wrap">
        {items.map((item, i) => {
          if (!item.caption) { return null }
          const isCurrent = i === index
          return (
            <span
              key={item.video}
              className="apex-simple-slider__caption-pill"
              style={{ 
                opacity: isCurrent ? 1 : 0,
                transform: isCurrent ? 'scale(1)' : 'scale(0.92)',
                transition: 'opacity 0.35s ease, transform 0.35s ease',
                pointerEvents: isCurrent ? 'auto' : 'none'
              }}
            >
              {item.caption}
            </span>
          )
        })}
      </div>

      {/* Bottom Progress Dots Indicator */}
      <div className="apex-simple-slider__dots">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`apex-simple-slider__dot ${i === index ? 'is-active' : ''}`}
            onClick={() => gotoSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
})

export default SimpleVideoSlider


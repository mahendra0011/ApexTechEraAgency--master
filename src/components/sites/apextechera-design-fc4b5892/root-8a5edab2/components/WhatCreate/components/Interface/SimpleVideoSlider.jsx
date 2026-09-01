import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import gsap from 'gsap'

const SLIDE_DURATION = 0.7

const SimpleVideoSlider = forwardRef(function SimpleVideoSlider(
  { items, startIndex = 0, onIndexChange, initialTime = 0, isMobile = false },
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

  // Try to play a single video element, swallowing the AbortError that
  // fires when a play() request is interrupted (e.g. by a fast slide swap).
  // On mobile the slides are plain <img> elements (no .play()), so this is
  // a no-op there — guarded rather than skipped at each call site.
  const tryPlay = (el) => {
    if (!el || typeof el.play !== 'function') { return }
    try {
      const p = el.play()
      if (p && p.catch) { p.catch(() => {}) }
    } catch (e) { /* ignore */ }
  }

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
        tryPlay(el)
      } else {
        gsap.set(el, { xPercent: i > startIndex ? 100 : -100, zIndex: 0, visibility: 'hidden', opacity: 1 })
      }
    })

    return () => {
      const live = slidesRef.current.filter(Boolean)
      gsap.killTweensOf(live)
    }
  }, [startIndex])

  // Only pre-warm the CURRENT slide plus its immediate neighbours (prev/next).
  // Playing all 7 full-size videos at once overwhelms mobile hardware video
  // decoders (Android/iOS typically cap concurrent decode sessions), which
  // caused every <video> to abort loading (networkState: NETWORK_NO_SOURCE)
  // and left the fullscreen sequence showing a black screen with no video.
  // Neighbours further away stay paused with preload="metadata" until the
  // user actually navigates to them (gotoSlide() below already starts the
  // incoming slide just-in-time), keeping the "no black frame on switch"
  // feel without loading everything concurrently.
  useEffect(() => {
    const els = slidesRef.current.filter(Boolean)
    const warm = new Set([startIndex - 1, startIndex, startIndex + 1].filter(
      (i) => i >= 0 && i < els.length
    ))
    els.forEach((el, i) => {
      if (warm.has(i)) { tryPlay(el) }
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

    // Ensure next video is playing (no-op on mobile img slides)
    nextSlide.style.visibility = 'visible'
    if (nextSlide.paused) { tryPlay(nextSlide) }

    // Pre-warm the slide just beyond the one we're entering too, so the
    // NEXT swipe also has zero black-frame delay, without ever having
    // more than 3 videos actively decoding at once.
    const lookaheadIndex = nextIndex + direction
    const lookaheadSlide = slidesRef.current[lookaheadIndex]
    if (lookaheadSlide && lookaheadSlide.paused) { tryPlay(lookaheadSlide) }

    // The slide we just left two steps behind is no longer a neighbour —
    // pause it to free up a decoder slot (img slides have no .pause).
    const staleIndex = prevIndex - direction
    const staleSlide = slidesRef.current[staleIndex]
    if (staleSlide && staleIndex !== nextIndex && typeof staleSlide.pause === 'function' && !staleSlide.paused) { staleSlide.pause() }

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
    <div className="apex-simple-slider">
      {items.map((item, i) => {
        // Only the slide we start on (plus its immediate neighbour, handled
        // by the warm-up effect above) needs to be eager. Everything else
        // loads lazily so we never ask mobile decoders to handle all 7
        // videos at once (see the warm-up effect for why that breaks
        // playback on Android/iOS).
        const isInitialNeighbour = Math.abs(i - startIndex) <= 1
        // Android/mobile responsive: static poster images instead of videos,
        // so the fullscreen 7-slide sequence never asks the phone's decoder
        // to handle multiple concurrent videos. Desktop/Windows is untouched.
        if (isMobile) {
          return (
            <img
              key={item.video}
              ref={(el) => (slidesRef.current[i] = el)}
              className="apex-simple-slider__video"
              src={item.poster}
              alt={item.caption || ''}
              loading={isInitialNeighbour ? 'eager' : 'lazy'}
            />
          )
        }
        return (
          <video
            key={item.video}
            ref={(el) => (slidesRef.current[i] = el)}
            className="apex-simple-slider__video"
            autoPlay={isInitialNeighbour}
            muted
            loop
            playsInline
            preload={isInitialNeighbour ? 'auto' : 'metadata'}
          >
            <source src={item.video} type="video/mp4" />
          </video>
        )
      })}

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

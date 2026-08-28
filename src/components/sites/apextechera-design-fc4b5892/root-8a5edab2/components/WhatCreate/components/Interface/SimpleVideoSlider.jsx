import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import gsap from 'gsap'

const SLIDE_DURATION = 0.7

const SimpleVideoSlider = forwardRef(function SimpleVideoSlider(
  { items, startIndex = 0, onIndexChange, initialTime = 0 },
  ref
) {
  const slidesRef = useRef([])
  const currentIndexRef = useRef(startIndex)
  const isAnimatingRef = useRef(false)
  const [index, setIndex] = useState(startIndex)

  const onIndexChangeRef = useRef(onIndexChange)
  useEffect(() => { onIndexChangeRef.current = onIndexChange }, [onIndexChange])

  // Try to play a single video element, swallowing the AbortError that
  // fires when a play() request is interrupted (e.g. by a fast slide swap).
  const tryPlay = (el) => {
    if (!el) { return }
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

    // Ensure next video is playing
    nextSlide.style.visibility = 'visible'
    if (nextSlide.paused) { tryPlay(nextSlide) }

    // Pre-warm the slide just beyond the one we're entering too, so the
    // NEXT swipe also has zero black-frame delay, without ever having
    // more than 3 videos actively decoding at once.
    const lookaheadIndex = nextIndex + direction
    const lookaheadSlide = slidesRef.current[lookaheadIndex]
    if (lookaheadSlide && lookaheadSlide.paused) { tryPlay(lookaheadSlide) }

    // The slide we just left two steps behind is no longer a neighbour —
    // pause it to free up a decoder slot.
    const staleIndex = prevIndex - direction
    const staleSlide = slidesRef.current[staleIndex]
    if (staleSlide && staleIndex !== nextIndex && !staleSlide.paused) { staleSlide.pause() }

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

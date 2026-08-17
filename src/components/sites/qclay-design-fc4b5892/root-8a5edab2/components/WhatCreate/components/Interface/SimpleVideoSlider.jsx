import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import gsap from 'gsap'

/*
 * GSAP-driven video slider used inside the fullscreen service surface.
 *
 * One wheel gesture = exactly one video switch, animated with a GSAP timeline
 * (power4.inOut, ~1.2s) — the "Premium Push + Parallax" pattern:
 *
 *  - Incoming video:  xPercent 100 -> 0 (sweeps the full screen width),
 *                     z-index 2, so it moves OVER the outgoing video.
 *  - Outgoing video:  xPercent 0 -> -50 (half the distance), z-index 1.
 *                     The speed difference (100% vs 50%) creates the
 *                     parallax depth illusion — the outgoing video feels like
 *                     it is being pushed to a background layer.
 *  - Backward scroll mirrors everything (incoming slides in from the left).
 *
 * The slider is fully imperative: the parent calls next()/prev() through the
 * ref, and the timeline's onComplete commits the switch (updates React state
 * for the caption pill and notifies the parent). isAnimating is a ref, not
 * state, so there are no stale closures — a rapid scroll burst can never
 * queue a second switch while the first is still sweeping.
 *
 * IMPORTANT: every item's <video> stays mounted for the lifetime of the
 * slider (keyed by its own src, never by index/in/out role). Only transform
 * and z-index change, so videos never reload or flash on switch.
 */

// One gesture = one switch. The sweep itself is a fixed 1.2s power4.inOut —
// no wheel-progress tracking, so a switch can never be left half-finished.
const SLIDE_DURATION = 1.2

const SimpleVideoSlider = forwardRef(function SimpleVideoSlider(
  { items, startIndex = 0, onIndexChange, initialTime = 0 },
  ref
) {
  const slidesRef = useRef([])
  // Mutable animation state lives in refs so the GSAP timeline and the wheel
  // handler never read a stale closure.
  const currentIndexRef = useRef(startIndex)
  const isAnimatingRef = useRef(false)
  const [index, setIndex] = useState(startIndex)

  const onIndexChangeRef = useRef(onIndexChange)
  useEffect(() => { onIndexChangeRef.current = onIndexChange }, [onIndexChange])

  // Initial position setup + cleanup. Runs whenever startIndex changes or slider mounts
  useEffect(() => {
    currentIndexRef.current = startIndex
    setIndex(startIndex)
    const els = slidesRef.current.filter(Boolean)
    gsap.set(els, { xPercent: 100, zIndex: 0 })
    if (els[startIndex]) {
      gsap.set(els[startIndex], { xPercent: 0, zIndex: 10 })
      if (initialTime > 0) {
        const apply = () => { try { els[startIndex].currentTime = initialTime } catch (err) { /* not seekable yet */ } }
        if (els[startIndex].readyState >= 1) { apply() } else { els[startIndex].addEventListener('loadedmetadata', apply, { once: true }) }
      }
    }
    return () => {
      const live = slidesRef.current.filter(Boolean)
      gsap.killTweensOf(live)
      gsap.set(live, { clearProps: 'all' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startIndex])

  const gotoSlide = (nextIndex, direction) => {
    if (isAnimatingRef.current) { return }
    if (nextIndex < 0 || nextIndex >= items.length) { return }

    const currentSlide = slidesRef.current[currentIndexRef.current]
    const nextSlide = slidesRef.current[nextIndex]
    if (!currentSlide || !nextSlide) { return }

    isAnimatingRef.current = true

    // Reset all z-indexes first so no stale layer sits on top.
    gsap.set(slidesRef.current.filter(Boolean), { zIndex: 0 })

    const tl = gsap.timeline({
      onComplete: () => {
        currentIndexRef.current = nextIndex
        setIndex(nextIndex)
        onIndexChangeRef.current?.(nextIndex)
        isAnimatingRef.current = false
      }
    })

    if (direction === 1) {
      // Forward: current slide pushed to background (-50%), incoming sweeps from right (100% -> 0)
      gsap.set(currentSlide, { zIndex: 1 })
      gsap.set(nextSlide, { zIndex: 2 })
      const incomingDuration = currentIndexRef.current === 0 ? 0.7 : SLIDE_DURATION
      tl.to(currentSlide, { xPercent: -50, duration: SLIDE_DURATION, ease: 'power4.inOut' }, 0)
        .fromTo(nextSlide, { xPercent: 100 }, { xPercent: 0, duration: incomingDuration, ease: 'power4.inOut' }, 0)
    } else {
      // Backward: current slide pushed to background (+50%), incoming sweeps from left (-100% -> 0)
      gsap.set(currentSlide, { zIndex: 1 })
      gsap.set(nextSlide, { zIndex: 2 })
      tl.to(currentSlide, { xPercent: 50, duration: SLIDE_DURATION, ease: 'power4.inOut' }, 0)
        .fromTo(nextSlide, { xPercent: -100 }, { xPercent: 0, duration: SLIDE_DURATION, ease: 'power4.inOut' }, 0)
    }
  }

  // Imperative API for the parent's wheel handler: one call = one switch.
  useImperativeHandle(ref, () => ({
    next: () => {
      if (currentIndexRef.current < items.length - 1) {
        gotoSlide(currentIndexRef.current + 1, 1)
      }
    },
    prev: () => {
      if (currentIndexRef.current > 0) {
        gotoSlide(currentIndexRef.current - 1, -1)
      }
    },
    currentIndex: () => currentIndexRef.current,
    isAnimating: () => isAnimatingRef.current
  }))

  return (
    <div className="apex-simple-slider">
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
      <div className="apex-simple-slider__caption-wrap">
        {items.map((item, i) => {
          if (!item.caption) { return null }
          // Caption is fully opaque and static — it hard-swaps with the
          // committed video (timeline onComplete), no fade during the push.
          const isCurrent = i === index
          return (
            <span
              key={item.video}
              className="apex-simple-slider__caption-pill"
              style={{ opacity: isCurrent ? 1 : 0 }}
            >
              {item.caption}
            </span>
          )
        })}
      </div>
    </div>
  )
})

export default SimpleVideoSlider

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

/*
 * Lightweight replacement for a previous WebGL-based morph slider.
 * Same public API (next/prev/goToIndex + onIndexChange), but implemented
 * with plain CSS opacity/scale crossfade instead of a WebGL canvas.
 * This avoids the canvas/GL sizing issues that were causing the
 * fullscreen surface to get stuck instead of returning to the dashboard.
 *
 * IMPORTANT: every item's <video> stays mounted for the lifetime of the
 * slider (keyed by its own src, never by index/in/out role). Only the CSS
 * class driving opacity/z-index changes on switch. Previously the "in"
 * and "out" videos were keyed by role (`in-${src}` / `out-${src}`), so
 * React remounted a brand new <video> element on every switch — forcing
 * it to reload/rebuffer from frame 0, which is what caused the visible
 * black flash on each transition.
 */
const SimpleVideoSlider = forwardRef(function SimpleVideoSlider(
  { items, startIndex = 0, duration = 0.8, onIndexChange },
  ref
) {
  const [index, setIndex] = useState(startIndex)
  const [prevIndex, setPrevIndex] = useState(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    setIndex(startIndex)
    setPrevIndex(null)
  }, [startIndex])

  useEffect(() => () => {
    if (timeoutRef.current) { window.clearTimeout(timeoutRef.current) }
  }, [])

  const goTo = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= items.length || nextIndex === index) { return }
    setPrevIndex(index)
    setIndex(nextIndex)
    onIndexChange?.(nextIndex)
    if (timeoutRef.current) { window.clearTimeout(timeoutRef.current) }
    timeoutRef.current = window.setTimeout(() => {
      setPrevIndex(null)
    }, duration * 1000 + 60)
  }

  useImperativeHandle(ref, () => ({
    next: () => goTo(index + 1),
    prev: () => goTo(index - 1),
    goToIndex: (i) => goTo(i)
  }), [index, items.length])

  return (
    <div className="apex-simple-slider" style={{ '--apex-slider-duration': `${duration}s` }}>
      {items.map((item, i) => {
        const state = i === index ? 'in' : (i === prevIndex ? 'out' : 'idle')
        return (
          <video
            key={item.video}
            className={`apex-simple-slider__video apex-simple-slider__video--${state}`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={item.video} type="video/mp4" />
          </video>
        )
      })}
      <div className="apex-simple-slider__caption-wrap">
        {items.map((item, i) => (
          <span
            key={item.video}
            className={`apex-simple-slider__caption-pill ${i === index ? 'is-active' : ''}`}
          >
            {item.caption}
          </span>
        ))}
      </div>
    </div>
  )
})

export default SimpleVideoSlider
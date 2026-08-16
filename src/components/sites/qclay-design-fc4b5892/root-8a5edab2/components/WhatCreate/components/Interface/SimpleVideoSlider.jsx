import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

/*
 * Lightweight replacement for the reactbits MorphSlider.
 * Same public API (next/prev/goToIndex + onIndexChange), but implemented
 * with plain CSS opacity/scale crossfade instead of a WebGL canvas.
 * This avoids the canvas/GL sizing issues that were causing the
 * fullscreen surface to get stuck instead of returning to the dashboard.
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
      {prevIndex !== null && (
        <video
          key={`out-${items[prevIndex].video}`}
          className="apex-simple-slider__video apex-simple-slider__video--out"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={items[prevIndex].video} type="video/mp4" />
        </video>
      )}
      <video
        key={`in-${items[index].video}`}
        className="apex-simple-slider__video apex-simple-slider__video--in"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={items[index].video} type="video/mp4" />
      </video>
    </div>
  )
})

export default SimpleVideoSlider

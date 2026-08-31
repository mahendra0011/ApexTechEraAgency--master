import { useEffect, useRef } from 'react'

const Video = ({  src, poster, width, height }) => {
    const video = useRef()
    useEffect(() => {
        document.addEventListener('click', () => {
            if ( !video.current ) { return }
            video.current.play()
        }, { once: true } )
        document.addEventListener('touchstart', () => {
            if ( !video.current ) { return }
            video.current.play()
        }, { once: true } )
    },[])

    // Pause this video whenever it's scrolled out of view / covered by
    // another section, and resume when it's back on screen. Without this,
    // every usage of this shared component (Portfolio, RequestForm, Menu,
    // etc.) plays forever in the background on a single-page site like this
    // one where sections stay mounted and are just moved offscreen via
    // transforms — each one is a small but permanent CPU/GPU cost that adds
    // up and contributes to overall sluggishness/hang on mobile.
    useEffect(() => {
        const el = video.current
        if (!el) { return }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const p = el.play()
                    if (p && p.catch) { p.catch(() => {}) }
                } else {
                    el.pause()
                }
            })
        }, { threshold: 0.2 })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
            <video className='video-component' autoPlay={true} poster={poster} loop muted playsInline ref={ video } width={ width } height={ height }>
                <source src={ src } type="video/mp4" />
            </video>
    )
}

export default Video

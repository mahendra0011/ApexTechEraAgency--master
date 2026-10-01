import { useEffect, useRef } from 'react'

const Video = ({  src, poster, width, height }) => {
    const video = useRef()

    // Fallback for browsers that ignore programmatic muted autoplay: the first
    // user gesture may still start playback — but only while this clip is
    // actually on screen, so an off-screen card never claims a decoder slot.
    // The global videoGate (see lib/.../utils/videoGate.js) owns the normal
    // play/pause lifecycle for data-autoplay videos.
    useEffect(() => {
        const playIfVisible = () => {
            const el = video.current
            if ( !el ) { return }
            const rect = el.getBoundingClientRect()
            const onScreen = rect.bottom > 0 && rect.top < window.innerHeight
            if ( !onScreen ) { return }
            if ( !el.paused ) { cleanup(); return }
            try {
                const p = el.play()
                if ( p && p.catch ) { p.catch(() => {}) }
            } catch ( e ) { /* ignore */ }
            cleanup()
        }
        const cleanup = () => {
            document.removeEventListener('click', playIfVisible)
            document.removeEventListener('touchstart', playIfVisible)
        }
        document.addEventListener('click', playIfVisible)
        document.addEventListener('touchstart', playIfVisible)
        return cleanup
    },[])

    return (
            <video className='video-component' data-autoplay poster={poster} loop muted playsInline preload="metadata" ref={ video } width={ width } height={ height }>
                <source src={ src } type="video/mp4" />
            </video>
    )
}

export default Video

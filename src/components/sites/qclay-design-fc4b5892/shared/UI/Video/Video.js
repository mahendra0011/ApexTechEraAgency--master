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
    return (
            <video className='video-component' autoPlay={true} poster={poster} loop muted playsInline ref={ video } width={ width } height={ height }>
                <source src={ src } type="video/mp4" />
            </video>
    )
}

export default Video

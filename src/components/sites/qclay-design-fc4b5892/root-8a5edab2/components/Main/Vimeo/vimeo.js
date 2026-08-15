import { useRef, useEffect, useState } from "react";
import Player from "@vimeo/player";
import cn from "classnames";

import VimeoPreview from "../VimeoPreview/VimeoPreview"

const Vimeo = () => {
    const [activeModal, setActiveModal] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const vimeoPlayer = useRef();
    const iframeRef = useRef();
    const iframeModalRef = useRef();

    const setSize = () => {
        if (!iframeRef.current) return;
        let width = window.innerWidth;
        let height = window.innerHeight;
        if (width > 768) {
            width = height = Math.max(width, height);
        } 
        iframeRef.current.width = width;
        iframeRef.current.height = height;
    };

    const onClick = (ev) => {
        if (vimeoPlayer.current) {
            if(isPlaying) {
                vimeoPlayer.current?.pause();
                setIsPlaying(false);
            } else {
                vimeoPlayer.current?.play();
                setIsPlaying(true);
            }
            setActiveModal(true);
        }
    };

    useEffect(() => {
        const iframe = iframeModalRef.current;
        if(iframe) {
            const player = new Player(iframe, {
                autopause: false,
                background: false
            });

            vimeoPlayer.current = player;
        }
        
        setSize();
        window.addEventListener("resize", setSize);
        return () => window.removeEventListener("resize", setSize);
    }, []);

    return (
        <div className="vimeo-main">
            {!activeModal && (
                <iframe
                    title="qclay"
                    className="vimeo-main-video"
                    ref={iframeRef}
                    src="https://player.vimeo.com/sites/qclay-design-fc4b5892/root-8a5edab2/video/821037821?h=5b0c8dac09?autoplay=1&loop=1&muted=1&autopause=0&background=1&color=ffffff&controls=2&portrait=0"
                    width="640"
                    height="360"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                    allowFullScreen
                    webkitallowfullscreen="true"
                    mozallowfullscreen="true"
                />
            )}
            <VimeoPreview />
            <div className="vimeo-main-wrap" onClick={onClick}></div>
            <iframe
                ref={iframeModalRef}
                className="vimeo-main-wrap-video"
                title="QClay Showreel"
                src="https://player.vimeo.com/sites/qclay-design-fc4b5892/root-8a5edab2/video/821037821?controls=true&autoplay=false&loop=true&transparent=true&autopause=false&muted=false&playsinline=false&muted=1&quality=720p"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                scrolling="no"
                style={{ opacity: activeModal ? 1 : 0 }}
            />
            {!activeModal && (
                <div 
                    onClick={onClick}
                    className={cn("vimeo-play-btn", activeModal && "vimeo-play-btn--active")}
                >
                    <div className="triangle"></div>
                </div>
            )}
        </div>
    );
};

export default Vimeo;
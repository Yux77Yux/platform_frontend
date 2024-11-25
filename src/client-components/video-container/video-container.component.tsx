'use client';

import { useCallback, useRef } from "react";
import "./video-container.styles.scss";

const VideoContainer = () => {
    const vidContainer = useRef<null | HTMLDivElement>(null);
    const vid = useRef<null | HTMLVideoElement>(null);
    const initialX = useRef<number | null>(null);

    const vidMouseEnterHandler = useCallback((e: React.MouseEvent) => {
        if (!vid.current) return;
        initialX.current = e.clientX;
        vid.current.style.transition = "none";
    }, [initialX, vid])

    const vidMouseMoveHandler = useCallback((e: React.MouseEvent) => {
        if (!vid.current || !initialX.current) return;
        const disx = e.clientX - initialX.current;
        const move = 0 - disx / -30;
        vid.current.style.transform = `translate(${move}px, 0px)`;
    }, [initialX, vid])

    const vidMouseLeaveHandler = useCallback(() => {
        if (!vid.current) return;
        vid.current.style.transition = "0.3s ";
        vid.current.style.transform = "translate(0,0)";
    }, [vid])

    return (
        <div ref={vidContainer}
            className="video-container"
            onMouseEnter={vidMouseEnterHandler}
            onMouseMove={vidMouseMoveHandler}
            onMouseLeave={vidMouseLeaveHandler}>
            <video
                ref={vid}
                id="vid"
                loop
                autoPlay
                muted
                src="/video/headbanner.webm"
            ></video>
        </div>
    );
}

export default VideoContainer;
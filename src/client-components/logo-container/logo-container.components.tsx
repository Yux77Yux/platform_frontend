'use client';

import Image from "next/image";
import "./logo-container.styles.scss";
import { useCallback, useRef } from "react";

const LogoContainer = () => {
    const logo = useRef<null | HTMLDivElement>(null);
    const indexPointer = useRef<number>(0);

    const logoClickHandler = useCallback(() => {
        const vid = document.querySelector('#vid') as HTMLVideoElement;
        if (!vid) return;
        const value = indexPointer.current

        switch (value) {
            case 0:
                vid.src = "/video/2.webm";
                indexPointer.current++;
                break;
            case 1:
                vid.src = "/video/3.webm";
                indexPointer.current++;
                break;
            case 2:
                vid.src = "/video/4.webm";
                indexPointer.current++;
                break;
            case 3:
                vid.src = "/video/headbanner.webm";
                indexPointer.current++;
                break;
            default:
                indexPointer.current = 1;
                vid.src = "/video/2.webm";
        }
    }, [indexPointer]);

    return (
        <div className="bili-logo" ref={logo} onClick={logoClickHandler}>
            <Image
                src="/img/logo.png"
                width={170}
                height={90}
                alt=""
            />
            <span>戳我试试</span>
        </div>
    );
}

export default LogoContainer;
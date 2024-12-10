import VideoContainer from "@/src/client-components/video-container/video-container.component";
import LogoContainer from "@/src/client-components/logo-container/logo-container.components";
import "./sections-header.styles.scss"

const SectionsHeader = () => {
    return (
        <div className="banner-container">
            {/* 视频背景 */}
            <div style={{
                position: 'relative',
                top: 0,
                width: '100%',
            }}
            >
                <VideoContainer />
            </div>

            {/* Logo 和提示 */}
            <div style={{
                position: 'absolute',
                left: '150px',
                bottom: 0,
            }}>
                <LogoContainer />
            </div>
        </div>
    );
}

export default SectionsHeader;
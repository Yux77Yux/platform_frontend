import Link from "next/link";
import "./nav-container.styles.scss";

import SearchInputBox from "@/src/client-components/search-input-box/search-input-box.component";
import UserSection from "../user-section/user-section.component";

const NavContainer = () => {
    return (
        <div className="nav-container">
            <div style={{
                position: 'relative',
            }}>
                <div className="first-nav">
                    <Link href="/">首页</Link>
                </div>
            </div>

            {/* 搜索框 */}
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
            }}>
                <SearchInputBox />
            </div>

            {/* 用户区域 */}
            <div style={{
                position: 'relative',
            }}>
                <UserSection />
            </div>
        </div>
    );
}

export default NavContainer;
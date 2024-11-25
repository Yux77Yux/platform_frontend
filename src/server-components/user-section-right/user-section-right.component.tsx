import Link from "next/link";
import "./user-section-right.styles.scss";

const UserSectionRight = () => {
    return (
        <div className="user-right">
            <div className="user-detail">
                <Link href="#" style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>
                    投稿
                </Link>
            </div>
        </div>
    );
}

export default UserSectionRight;
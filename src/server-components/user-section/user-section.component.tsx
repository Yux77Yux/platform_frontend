import UserSectionLeft from "../user-section-left/user-section-left.component";
import UserSectionRight from "../user-section-right/user-section-right.component";
import "./user-section.styles.scss";

const UserSection = () => {
    return (
        <div className="user-section">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                width: '80%',
                height: '100%',
            }}>
                <UserSectionLeft />
            </div>

            <div style={{
                display: 'flex',
            }}>
                <UserSectionRight />
            </div>
        </div>
    );
}

export default UserSection;
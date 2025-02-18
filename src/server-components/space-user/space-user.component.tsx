import Link from "next/link";
import Image from "next/image";
import "./space-user.styles.scss";

interface PropsType {
    user: {
        userDefault: { userName: string, userId: string };
        userAvatar: string;
        userBio: string;
    };
    master: boolean
}

const SpaceUser = (props: PropsType) => {
    const { user, master } = props;
    const { userAvatar, userDefault, userBio } = user;
    const { userName, userId } = userDefault;

    const avatar = userAvatar === "" ? "/img/slience.jpg" : userAvatar
    return (
        <>
            <Link href={`/space/${userId}/setting`} className="space-avatar" style={{
                pointerEvents: master ? "auto" : "none",
            }}>
                <Image src={avatar}
                    id="user-avatar"
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={100}
                    alt=""
                />
                {master && <span className="hide">更换头像</span>}
            </Link>
            <span className="space-name">{userName === "" ? "今州皇帝" : userName}</span>
            <span className="space-bio">{userBio === "" ? "userBio" : userBio}</span>
            {!master && <button className="space-follow">关注</button>}
            {!master && <button className="space-review-box">···</button>}
            {!master && <button className="space-review">举报</button>}
        </>
    );
}

export default SpaceUser;
import Link from "next/link";
import Image from "next/image";
import "./space-user.styles.scss";

interface PropsType {
    user: {
        userDefault: { userName: string, userId: string };
        userAvator: string;
        userBio: string;
    };
    master: boolean
}

const SpaceUser = (props: PropsType) => {
    const { user, master } = props;
    const { userAvator, userDefault, userBio } = user;
    const { userName, userId } = userDefault;

    const avator = userAvator === '' ? "/img/slience.jpg" : userAvator
    return (
        <>
            <Link href={`/space/${userId}/setting`} className="space-avator" style={{
                pointerEvents: master ? "auto" : "none",
            }}>
                <Image src={avator}
                    id="user-avator"
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
        </>
    );
}

export default SpaceUser;
import Link from "next/link";
import { cookies } from "next/headers";
import "./user-section-left.styles.scss";
import LogoutLink from "./logout.link";
import UserAvatar from "./avatar";

const NoAvatorOption = (props: { desctiption: string, name: string }) => {
    const { name, desctiption } = props;
    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
                width: '80%',
                backgroundColor: 'transparent',
                fontSize: '14px',
                color: 'rgb(111,111,111)',
            }}>{desctiption}</div>
            <Link href="/auth" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '36px',
                width: '80%',
                marginTop: '6px',
                backgroundColor: 'rgb(28, 111, 219)',
                color: 'white',
                fontSize: '16px',
                borderRadius: '10px',
            }}>{name}</Link>
        </>
    );
}

const UserSectionLeft = async () => {
    const userCookie = (await cookies()).get('loginUser');
    const isLoggedIn = userCookie ? true : false;
    let user;
    if (isLoggedIn) {
        const userData = userCookie!.value;
        user = JSON.parse(userData);
    }

    return (
        <div className="user-section-left">
            <div className="user-avator-box">
                <div className="show">
                    {isLoggedIn
                        ? <div className="avator-card-container">
                            <div className="avator-card-flex">
                                <Link href="#" className="avator-card"></Link>
                                <Link href={`/space/${user.id}`} className="avator-card">个人投稿</Link>
                                <Link href="#" className="avator-card">投稿管理</Link>
                                <Link href="#" className="avator-card">推荐服务</Link>
                                <LogoutLink />
                            </div>
                        </div>
                        : <div className="no-avator-card">
                            <NoAvatorOption desctiption="登录即可查看个人中心" name="立即登录" />
                            <div style={{
                                textDecoration: 'none',
                                pointerEvents: 'none',
                                fontSize: '14px',
                                margin: '10px'
                            }}>首次使用？
                                <Link href="/auth" style={{
                                    margin: '10px',
                                    color: 'rgb(49, 128, 233)',
                                    textDecoration: 'underline',
                                    pointerEvents: 'auto',
                                }}> 点我注册</Link>
                            </div>
                        </div>
                    }
                </div>
                {isLoggedIn
                    ? <div className="user-avator">
                        <UserAvatar id={user.id} />
                    </div>
                    : <Link href="/auth" className="no-avator">登录</Link>
                }
            </div>

            {/* 消息 */}
            <div className="nav-option">
                <div className="show">
                    {isLoggedIn
                        ? <div className="msg-option-container">
                            <div className="msg-option-flex">
                                <Link href="#" className="msg-card">回复我的</Link>
                                <Link href="#" className="msg-card">@我的</Link>
                                <Link href="#" className="msg-card">收到的赞</Link>
                                <Link href="#" className="msg-card">系统消息</Link>
                                <Link href="#" className="msg-card">我的消息</Link>
                            </div>
                        </div>
                        : <div className="no-avator-card">
                            <NoAvatorOption desctiption="登录即可查看消息" name="立即登录" />
                        </div>
                    }
                </div>
                <Link href="#">消息</Link>
            </div>
            {/* 动态 */}
            {/* <div className="nav-option">
                <div className="show">
                    {isLoggedIn
                        ? <div className="dynamics-option-container">
                            <div className="dynamics-option-flex">
                            </div>
                        </div>
                        : <div className="no-avator-card">
                            <NoAvatorOption desctiption="登录即可查看动态" name="立即登录" />
                        </div>
                    }
                </div>
                <Link href="#">动态</Link>
            </div> */}
            {/* 收藏 */}
            <div className="nav-option">
                <div className="show">
                    {isLoggedIn
                        ? <div className="collections-option-container">
                            <div className="collections-option-flex">
                            </div>
                        </div>
                        : <div className="no-avator-card">
                            <NoAvatorOption desctiption="登录即可查看收藏" name="立即登录" />
                        </div>
                    }
                </div>
                <Link href="#">收藏</Link>
            </div>
            {/* 历史 */}
            <div className="nav-option">
                <div className="show">
                    {isLoggedIn
                        ? <div className="history-option-container">
                            <div className="history-option-flex">
                            </div>
                        </div>
                        : <div className="no-avator-card">
                            <NoAvatorOption desctiption="登录即可查看历史" name="立即登录" />
                        </div>
                    }
                </div>
                <Link href="#">历史</Link>
            </div>
        </div>
    );
}

export default UserSectionLeft;
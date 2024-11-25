import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import "./user-section-left.styles.scss";

const NoAvatorOptions = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
        }}>
            <Link href="#" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '40px',
                marginTop: '6px',
                backgroundColor: 'black',
                color: 'white',
                fontSize: '16px',
                borderRadius: '10px',
            }}>立即登录</Link>
            <Link href="#" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '40px',
                marginTop: '6px',
                backgroundColor: 'black',
                color: 'white',
                fontSize: '16px',
                borderRadius: '10px',
            }}>立即注册</Link>
        </div>
    );
}

const UserSectionLeft = async () => {
    const userCookie = (await cookies()).get('userLogin');
    const isLoggedIn = userCookie ? true : false;

    return (
        <div className="user-section-left">
            <div className="user-avator-box">
                <div className="show">
                    {isLoggedIn
                        ? <div className="avator-card-container">
                            <div className="avator-card-flex">
                                <Link href="#" className="avator-card"></Link>
                                <Link href="#" className="avator-card">个人投稿</Link>
                                <Link href="#" className="avator-card">投稿管理</Link>
                                <Link href="#" className="avator-card">推荐服务</Link>
                                <Link href="#" className="avator-card">退出登录</Link>
                            </div>
                        </div>
                        : <div className="no-avator-card">
                            <NoAvatorOptions />
                        </div>
                    }
                </div>
                {isLoggedIn
                    ? <div className="user-avator">
                        <Image src="/img/slience.jpg"
                            id="user-avator"
                            layout="responsive"
                            width={40}
                            height={40}
                            quality={100}
                            alt=""
                        />
                    </div>
                    : <Link href="#" className="no-avator">登录</Link>
                }
            </div>

            <Link href="#"><span>消息</span></Link>
            <Link href="#"><span>动态</span></Link>
            <Link href="#"><span>收藏</span></Link>
            <Link href="#"><span>历史</span></Link>
            <Link href="#"><span>创作中心</span></Link>
        </div>
    );
}

export default UserSectionLeft;
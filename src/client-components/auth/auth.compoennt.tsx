'use client';

import { setCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from "react";
import "./auth.styles.scss";

const Auth = () => {
    const form = useRef<null | HTMLFormElement>(null)
    const [isLoading, setIsLoading] = useState(true); // 防止页面内容渲染
    const router = useRouter();

    useEffect(() => {
        const loginUser = getCookie('loginUser');
        if (loginUser) {
            router.back();
        } else {
            setIsLoading(false); // 没有登录状态时，允许渲染页面内容
        }
    }, [router]);

    // 注册
    const registerHandler = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();  // 阻止默认的表单提交行为
        if (!form.current) return;

        const formData = new FormData(form.current);
        const data = Object.fromEntries(formData.entries());
        data.userRole = "USER";

        try {
            const response = await fetch('http://localhost:8080/api/user/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",  // 确保请求头设置正确
                },
                body: JSON.stringify(data),  // 将表单数据作为 JSON 发送
            });

            if (response.ok) {
                const result = await response.json();  // 解析 JSON 响应
                console.log("Response:", result);
            } else {
                console.log("Error response:", response.status, response.statusText);
                const error = await response.text();  // 你可以先尝试解析为文本来查看错误消息
                console.log("Error message:", error);
            }
        } catch (error) {
            console.log("Request failed", error);
        }
    }, []);

    // 登录
    const loginHandler = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();  // 阻止默认的表单提交行为
        if (!form.current) return;

        const formData = new FormData(form.current);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://localhost:8080/api/user/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),  // 将表单数据作为 JSON 发送
            });

            if (response.ok) {
                const result = await response.json();  // 解析 JSON 响应
                setCookie('loginUser', JSON.stringify({
                    id: result.userLogin.userDefault.userId,
                    name: result.userLogin.userDefault.userName,
                    avator: result.userLogin.userAvator,
                    role: result.userLogin.userRole
                }), {
                    maxAge: 604800,  // 设置 token 过期时间 (例如 7天)
                    path: '/',
                    httpOnly: false,
                    sameSite: 'strict',  // 防止 CSRF 攻击
                });
                setCookie('refreshToken', result.tokens.refreshToken.value, {
                    maxAge: 604800,  // 设置 token 过期时间 (例如 7天)
                    path: '/',
                    httpOnly: false,
                    sameSite: 'strict',  // 防止 CSRF 攻击
                });
                setCookie('accessToken', result.tokens.accessToken.value, {
                    maxAge: 1800,  // 设置 token 过期时间 (30 minutes)
                    path: '/',
                    httpOnly: false,
                    sameSite: 'strict',  // 防止 CSRF 攻击
                });

                localStorage.setItem('refreshToken', result.tokens.refreshToken.expiresAt);
                localStorage.setItem('accessToken', result.tokens.accessToken.expiresAt);
                localStorage.setItem('avatar', result.userLogin.userAvator);

                window.location.reload();
            } else {
                console.log("Error response:", response.status, response.statusText);
                const error = await response.text();
                console.log("Error message:", error);
            }
        } catch (error) {
            console.log("Request failed", error);
        }
    }, []);

    if (isLoading) {
        return null; // 加载中，不渲染页面
    }

    return (
        <div className="auth-box">
            <form ref={form} method="POST" className="form-box">
                <div className="data-msg-box">
                    <div className="data-msg">
                        <label htmlFor="username">账号
                            <input type="text"
                                name="username"
                                id="user_username"
                                placeholder="请输入账号"
                                autoComplete='off'
                                autoCapitalize='off'
                                autoCorrect='off'
                            />
                        </label>
                    </div>
                    <div className="data-msg">
                        <label htmlFor="password">密码
                            <input type="password"
                                name="password"
                                id="user_password"
                                placeholder="请输入密码"
                                autoComplete='off'
                                autoCapitalize='off'
                                autoCorrect='off'
                            />
                        </label>
                    </div>
                    <div className="data-msg">
                        <label htmlFor="email">邮箱
                            <input type="text"
                                name="userEmail"
                                id="user_email"
                                placeholder="可选，请输入邮箱"
                                autoComplete='off'
                                autoCapitalize='off'
                                autoCorrect='off'
                            />
                        </label>
                    </div>
                </div>

                <div className="submit-box">
                    <button
                        type="button"
                        onClick={(e) => loginHandler(e)}
                    >
                        登录
                    </button>
                    <button
                        type="button"
                        onClick={(e) => registerHandler(e)}
                    >
                        注册
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Auth;
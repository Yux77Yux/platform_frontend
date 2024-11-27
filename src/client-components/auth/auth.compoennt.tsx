'use client';

import "./auth.styles.scss";
import { useCallback, useRef } from "react";

const Auth = () => {
    const login = "/api/login";
    const register = "/api/register";
    const form = useRef<null | HTMLFormElement>(null)

    const handleSubmit = useCallback(async (e: React.FormEvent, action: string) => {
        e.preventDefault();  // 阻止默认的表单提交行为
        if (!form.current) return;

        const formData = new FormData(form.current);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(action, {
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
                // 如果响应状态不是 200 OK，处理错误
                console.error("Error response:", response.status, response.statusText);
                const error = await response.text();  // 你可以先尝试解析为文本来查看错误消息
                console.log("Error message:", error);
            }
        } catch (error) {
            console.error("Request failed", error);
        }
    }, []);

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
                                name="email"
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
                        onClick={(e) => handleSubmit(e, login)}
                    >
                        登录
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e, register)}
                    >
                        注册
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Auth;
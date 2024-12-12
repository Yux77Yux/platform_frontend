'use client';

import Link from "next/link";
import { useCallback, useEffect } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next/client";

export default function LogoutLink() {
    const logout = useCallback(() => {
        deleteCookie("loginUser");
        deleteCookie("refreshToken");
        deleteCookie("accessToken");

        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");

        setTimeout(() => window.location.reload(), 600);
    }, []);

    // 无感刷新
    const refreshHandler = useCallback(async () => {
        try {
            const refreshToken = getCookie('refreshToken');
            if (!refreshToken) {
                throw new Error('Refresh token is missing or empty');
            }

            const response = await fetch('http://localhost:8080/api/auth/refresh', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ value: refreshToken })
            });
            if (!response.ok) {
                console.error('Failed to refresh Access Token');
            }

            const result = await response.json()
            localStorage.setItem('accessToken', result.accessToken.expiresAt);
            setCookie('accessToken', result.accessToken.value, {
                maxAge: 1800,  // 设置 token 过期时间 (30 minutes)
                path: '/',
                httpOnly: false,
                sameSite: 'strict',  // 防止 CSRF 攻击
            });

        } catch (error) {
            console.error('Error refreshing Access Token:', error);
        }
    }, []);

    const refreshInterval = useCallback(() => {
        // 获取 refreshToken 和 accessToken
        const loginUser = getCookie('loginUser');
        if (!loginUser) {
            console.log("not login");
            return;
        }

        const refreshToken = localStorage.getItem('refreshToken');
        const accessToken = localStorage.getItem('accessToken');
        if (!refreshToken || !accessToken) {
            console.log("not token");
            return;
        }

        // 获取当前时间戳（秒）
        const currentTime = Date.now() / 1000;  // 当前时间戳（秒）
        // 将 ISO 8601 字符串转换为 Date 对象
        const access_expiresAt = new Date(accessToken);
        const refresh_expiresAt = new Date(refreshToken);
        // 获取 Access Token 的过期时间戳（秒）
        const accessTokenExpiresAtInSeconds = access_expiresAt.getTime() / 1000;  // 转换为秒
        const refreshTokenExpiresAtInSeconds = refresh_expiresAt.getTime() / 1000;  // 转换为秒

        if (refreshTokenExpiresAtInSeconds - currentTime < 300) {
            // refreshToken过期
            logout();
            return;
        }

        // 如果距离过期时间少于119秒，执行刷新操作
        if (accessTokenExpiresAtInSeconds - currentTime < 300) {
            refreshHandler();
        }
    }, [logout,refreshHandler]);

    // 设置无感刷新
    useEffect(() => {
        refreshInterval();
        const refresh = setInterval(refreshInterval, 240000);  // 每4分钟(240000)检查一次
        return () => clearInterval(refresh);
    }, [refreshInterval]);

    return <Link href="#" className="avator-card" onClick={logout}>退出登录</Link>
}
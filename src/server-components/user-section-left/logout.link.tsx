'use client';

import Link from "next/link";
import { useCallback, useEffect } from "react";
import { deleteCookie } from "cookies-next";
import { getCookie } from "cookies-next/client";

export default function LogoutLink() {
    // 无感刷新
    const refreshHandler = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/refresh', {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                console.error('Failed to refresh Access Token');
            }

            const result = await response.json()
            localStorage.setItem('accessToken', JSON.stringify({
                value: result.accessToken.value,
                expiresAt: result.accessToken.expiresAt
            }));
        } catch (error) {
            console.error('Error refreshing Access Token:', error);
        }
    }, []);
    // 设置无感刷新
    useEffect(() => {
        const refresh = setInterval(() => {
            // 获取 refreshToken 和 accessToken
            const loginState = getCookie('loginState');
            if (!loginState) {
                console.log("not found");
                return;
            }
            console.log("found");

            const accessToken = JSON.parse(localStorage.getItem('accessToken') ?? "");
            if (accessToken === "") {
                refreshHandler();
                return;
            }

            // 获取当前时间戳（秒）
            const currentTime = Date.now() / 1000;  // 当前时间戳（秒）
            // ISO 8601 格式的字符串过期时间
            const accessTokenExpiresAt = accessToken.expiresAt; // Access Token 过期时间（秒）
            // 将 ISO 8601 字符串转换为 Date 对象
            const expiresAt = new Date(accessTokenExpiresAt);
            // 获取 Access Token 的过期时间戳（秒）
            const accessTokenExpiresAtInSeconds = expiresAt.getTime() / 1000;  // 转换为秒

            // 如果距离过期时间少于5分钟（300秒），执行刷新操作
            if (accessTokenExpiresAtInSeconds - currentTime <= 300) {
                refreshHandler();
            }
        }, 240000);  // 每4分钟(240000)检查一次

        return () => clearInterval(refresh);
    }, [refreshHandler]);

    const logout = useCallback(() => {
        deleteCookie("loginState");
        deleteCookie("refreshToken");

        localStorage.removeItem("accessToken");

        setTimeout(()=>window.location.reload(),600);
    }, []);

    return <Link href="#" className="avator-card" onClick={logout}>退出登录</Link>
}
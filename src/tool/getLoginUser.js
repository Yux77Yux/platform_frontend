import { cookies } from "next/headers";

export const getToken = async () => {
    if (typeof window !== "undefined") {
        // 浏览器端获取 Cookie
        const cookies = document.cookie.split("; ");
        const accessTokenCookie = cookies.find(row => row.startsWith("accessToken="));
        return accessTokenCookie ? decodeURIComponent(accessTokenCookie.split("=")[1]) : "";
    } else {
        // 服务器端获取 Cookie
        const accessTokenCookie = (await cookies()).get('accessToken');
        
        return accessTokenCookie ? accessTokenCookie.value : "";
    }
};

// 解析 JWT 获取 userId
export const getLoginUserId = async () => {
    const token = await getToken();
    if (!token) return -1;

    try {
        const base64Url = token.split(".")[1];
        if (!base64Url) return -1;  // 防止 token 格式错误

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));

        const userId= payload.userId ? BigInt(payload.userId) : payload.user_id ? BigInt(payload.user_id) : -1n;
        return ""+userId
    } catch (error) {
        console.log("JWT 解析失败:", error);
        return -1;
    }
};

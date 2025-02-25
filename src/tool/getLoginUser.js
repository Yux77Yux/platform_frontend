export const getToken = async () => {
    if (typeof window !== "undefined") {
        // 浏览器端获取 Cookie
        const cookies = document.cookie.split("; ");
        const accessTokenCookie = cookies.find(row => row.startsWith("accessToken="));
        return accessTokenCookie ? decodeURIComponent(accessTokenCookie.split("=")[1]) : "";
    } else {
        // **服务器端** 获取 Cookie（动态引入 next/headers，避免 Next.js 解析时出错）
        const { cookies } = await import("next/headers");
        const accessTokenCookie = (await cookies()).get('accessToken');

        return accessTokenCookie ? accessTokenCookie.value : "";
    }
};

export const getLoginUser = async () => {
    if (typeof window !== "undefined") {
        // 浏览器端获取 Cookie
        const { getCookie } = await import("cookies-next")

        const loginUser = getCookie("loginUser");
        if (!loginUser) {
            console.log("not login");
            return null;
        }
        try {
            return JSON.parse(loginUser);
        } catch (e) {
            console.error("Failed to parse loginUser cookie:", e);
            return null;
        }
    } else {
        // **服务器端** 获取 Cookie（动态引入 next/headers，避免 Next.js 解析时出错）
        const { cookies } = await import("next/headers");
        const loginUser = (await cookies()).get('loginUser');

        if (!loginUser) {
            console.log("not login");
            return null;
        }
        try {
            return JSON.parse(loginUser.value); // `cookies().get()` 返回 `{ name, value }`
        } catch (e) {
            console.error("Failed to parse loginUser cookie:", e);
            return null;
        }
    }
}

const getTokenClaim = async () => {
    const token = await getToken();
    if (!token) return -1;

    try {
        const base64Url = token.split(".")[1];
        if (!base64Url) return -1;  // 防止 token 格式错误

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));

        return payload
    } catch (error) {
        console.log("JWT 解析失败:", error);
        return -1;
    }
}

// 解析 JWT 获取 userId
export const getLoginUserId = async () => {
    try {
        const claims = await getTokenClaim()

        const userId = claims ? BigInt(claims.user_id) : 0;
        return userId
    } catch (error) {
        console.log("JWT 解析失败:", error);
        return -1;
    }
};

export const getLoginUserRole = async () => {
    try {
        const claims = await getTokenClaim()

        const role = claims ? claims.role : "GUEST";
        return role
    } catch (error) {
        console.log("JWT 解析失败:", error);
        return -1;
    }
};


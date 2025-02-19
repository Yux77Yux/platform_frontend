export async function getAddress() {
    try {
        const response = await fetch("https://api-bdc.net/data/client-ip");
        const data = await response.json();

        // 只返回 IPv4，IPv6 直接忽略
        if (data.ipString) {
            return data.ipString;
        }
        return "127.0.0.1"; // 兜底 IPv4
    } catch (error) {
        console.log("Error fetching IP:", error);
        return "127.0.0.1";
    }
}

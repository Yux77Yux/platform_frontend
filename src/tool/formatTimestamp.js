export function formatTimestamp(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-");
}
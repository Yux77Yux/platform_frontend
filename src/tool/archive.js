import { getToken, getLoginUserId } from './getLoginUser'

export const uploadArchive = async (order, file) => {
    if (order != 1 && order != 2) return
    const token = await getToken();
    const accessToken = {
        value: token
    }
    try {
        const formData = new FormData();
        formData.append("archive", file);         // 上传的文件
        formData.append("order", order);       // 附加字段
        formData.append("accessToken", JSON.stringify(accessToken));       // 附加字段

        const response = await fetch("http://localhost:8080/api/archive", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`上传失败：HTTP ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.log("uploadArchive failed:", error);
    }
};

export const saveArchive = async (order) => {
    const token = await getToken();
    const body = {
        accessToken: {
            value: token,
        },
        order: order,
    }
    console.log(body)
    try {
        const response = await fetch("http://localhost:8080/api/archive", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`保存失败：HTTP ${response.status}`);
        }

        const blob = await response.blob(); // 拿到文件数据

        // 生成下载链接
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        const disposition = response.headers.get("Content-Disposition");
        const match = disposition && disposition.match(/filename="(.+)"/);
        const filename = match ? match[1] : "archive.jsonl";

        a.download = filename;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.log("uploadArchive failed:", error);
    }
};

export const getArchivesExist = async () => {
    const id = await getLoginUserId();
    try {
        const response = await fetch(`http://localhost:8080/api/archive/order?userId=${id}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`获取失败：HTTP ${response.status}`);
        }
        console.log("OKK")
        const result = await response.json();
        return result;
    } catch (error) {
        console.log("uploadArchive failed:", error);
    }
};

export const chooseArchive = async (order) => {
    const token = await getToken();
    const body = {
        accessToken: {
            value: token
        },
        order: order,
    }
    try {
        const response = await fetch("http://localhost:8080/api/archive/order", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`选择失败：HTTP ${response.status}`);
        }

        return await response.json()
    } catch (error) {
        console.log("uploadArchive failed:", error);
    }
};

import { Api_Status } from "@/src/tool/api-status"
import { getToken } from "./getLoginUser";

export const fetchCollections = async (page) => {
    const token = await getToken()
    const pageNum = page <= 0 ? 1 : page
    const body = {
        accessToken: {
            value: token
        },
        page: pageNum,
    }

    const response = await fetch(`http://localhost:8080/api/collections/fetch`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        alert("玩略过不提")
        return null
    }

    const result = await response.json()
    console.log(result)
    const msg = result.msg
    if (msg.status != Api_Status.SUCCESS) {
        return false
    }
    return result
}

export const fetchHistory = async (page) => {
    const token = await getToken()
    const pageNum = page <= 0 ? 1 : page
    const body = {
        accessToken: {
            value: token
        },
        page: pageNum,
    }

    const response = await fetch(`http://localhost:8080/api/history/fetch`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        alert("玩略过不提")
        return null
    }

    const result = await response.json()
    console.log(result)
    const msg = result.msg
    if (msg.status != Api_Status.SUCCESS) {
        return false
    }
    return result
}

export const fetchHome = async () => {
    const token = await getToken()
    const body = {
        accessToken: {
            value: token
        },
    }

    const response = await fetch(`http://localhost:8080/api/home/fetch`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        return null
    }

    const result = await response.json()
    console.log(result)
    const msg = result.msg
    if (msg.status != Api_Status.SUCCESS) {
        return false
    }
    return result
}

export const fetchSimilarCreaiton = async (creationId) => {
    const response = await fetch(`http://localhost:8080/api/watch/similar/${creationId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        alert("玩略不提")
        return null
    }

    const result = await response.json()
    const msg = result.msg
    if (msg.status != Api_Status.SUCCESS) {
        return false
    }
    return result
}

export const searchCreaiton = async (title, page) => {
    const response = await fetch(`http://localhost:8080/api/search/videos/${title}/${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        alert("玩略不提")
        return null
    }

    const result = await response.json()
    const msg = result.msg
    if (msg.status != Api_Status.SUCCESS) {
        return false
    }
    return result
}
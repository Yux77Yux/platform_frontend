import { Api_Status } from "@/src/tool/api-status"
import { getLoginUserId, getToken } from "./getLoginUser";

export const ByCount = Object.freeze({
    PUBLISHED_TIME: "PUBLISHED_TIME",
    VIEWS: "VIEWS",
    LIKES: "LIKES",
    COLLECTIONS: "COLLECTIONS",
})

export const fetchCreationInfo = async (userId, page, type) => {
    const response = await fetch(`http://localhost:8080/api/creation/space/${userId}/${page}/${type}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        return null
    }

    const result = await response.json()
    const msg = result.msg
    if (msg.status != Api_Status.SUCCESS) {
        return false
    }
    return result
}

export const followUser = async (userId) => {
    const token = await getToken()
    const body = {
        accessToken: {
            value: token,
        },
        follow: {
            followeeId: userId,
        },
    }
    const response = await fetch("http://localhost:8080/api/user/follow", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        alert("follow网络不通")
        return null
    }
    const result = await response.json()
    console.log(result)
    const msg = result.msg
    if (msg.status != Api_Status.SUCCESS && msg.status != Api_Status.PENDING) {
        return false
    }

    return true
}

export const cancelFollow = async (userId) => {
    const token = await getToken()
    const body = {
        accessToken: {
            value: token,
        },
        follow: {
            followeeId: userId,
        },
    }
    const response = await fetch("http://localhost:8080/api/user/follow", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        return null
    }

    return true
}

export const existFollowee = async (followee_id) => {
    const loginId = await getLoginUserId()
    const response = await fetch(`http://localhost:8080/api/user/follow/get/${followee_id}/${loginId.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        return null
    }
    const result = await response.json()
    const msg = result.msg
    if (msg.status != Api_Status.SUCCESS) {
        return false
    }

    return result.exist
}

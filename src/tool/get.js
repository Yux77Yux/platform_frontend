import { Api_Status } from "@/src/tool/api-status"
import {  getToken } from "./getLoginUser";

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
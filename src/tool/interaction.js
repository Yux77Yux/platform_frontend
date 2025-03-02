import { Api_Status } from "./api-status";

export const Operate = Object.freeze({
    VIEW: "VIEW",
    LIKE: "LIKE",
    CANCEL_COLLECT: "CANCEL_COLLECT",
    COLLECT: "COLLECT",
    CANCEL_LIKE: "CANCEL_LIKE",
    DEL_VIEW: "DEL_VIEW",
});

export const cancelCollections = async (creationIds, token) => {
    const body = {
        accessToken: {
            value: token,
        },
        bases: creationIds,
    }
    try {
        const response = await fetch("http://localhost:8080/api/interaction/collection/cancel",
            {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        )
        if (!response.ok) {
            console.log("api/interaction/collection/cancel error")
            return false
        }
        const result = await response.json()
        const { status } = result.msg
        if (status != Api_Status.SUCCESS && status != Api_Status.PENDING) {
            console.log(result);
            return false
        }

        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const delHistories = async (creationIds, token) => {
    const body = {
        accessToken: {
            value: token,
        },
        bases: creationIds,
    }
    try {
        const response = await fetch("http://localhost:8080/api/interaction/history/cancel",
            {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        )
        if (!response.ok) {
            console.log("api/interaction/history/cancel error")
            return false
        }
        const result = await response.json()
        const { status } = result.msg
        if (status != Api_Status.SUCCESS && status != Api_Status.PENDING) {
            console.log(result);
            return false
        }

        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
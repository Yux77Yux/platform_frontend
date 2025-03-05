import { Api_Status } from "./api-status";

export const Type = Object.freeze({
    CREATION: "CREATION",
    USER: "USER",
    COMMENT: "COMMENT",
});

export const Status = Object.freeze({
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    DELETED: "DELETED",
});

export const reportInfo = async (target_type, target_id, detail) => {
    if (detail.trim().length <= 0) {
        return null
    }
    try {
        let type = ""
        switch (target_type) {
            case Type.CREATION:
                type = Type.CREATION;
                break;
            case Type.USER:
                type = Type.USER;
                break;
            case Type.COMMENT:
                type = Type.COMMENT;
                break;
        }
        if (type == "") {
            console.log(`error: target_type ${target_type} is not true`)
            return null
        }

        const body = {
            new: {
                targetId: target_id,
                targetType: type,
                msg: detail,
            }
        }
        console.log(body)
        const response = await fetch("http://localhost:8080/api/review", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
        });
        if (!response.ok) {
            alert("网络不通")
            return null
        }
        const result = await response.json()
        const { status } = result.msg
        if (status != Api_Status.SUCCESS && status != Api_Status.PENDING) {
            alert("请求失败")
            console.log(result)
            return false
        }

        return result
    } catch (error) {
        console.log(error)
    }
}

const getBody = (target_status, page, token) => {
    let status = ""
    switch (target_status) {
        case Status.APPROVED:
            status = Status.APPROVED;
            break;
        case Status.PENDING:
            status = Status.PENDING;
            break;
        case Status.DELETED:
            status = Status.DELETED;
            break;
        case Status.REJECTED:
            status = Status.REJECTED;
            break;
    }
    if (status == "") {
        alert(`error: target_type ${target_type} is not true`)
        return null
    }

    const body = {
        accessToken: { value: token },
        status,
        page,
    }
    return body
}

export const getCreationReviews = async (target_status, page, token) => {
    if (page <= 0) page = 1

    try {
        const body = getBody(target_status, page, token)
        const response = await fetch("http://localhost:8080/api/review/query/creation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
        });
        if (!response.ok) {
            alert("网络不通")
            return null
        }

        const result = await response.json()
        const msgStatus = result.msg.status
        if (msgStatus != Api_Status.SUCCESS && msgStatus != Api_Status.PENDING) {
            alert("请求失败")
            console.log(result)
            return false
        }

        return result
    } catch (error) {
        console.log(error)
    }
}

export const getUserReviews = async (target_status, page, token) => {
    if (page <= 0) page = 1

    try {
        const body = getBody(target_status, page, token)
        const response = await fetch("http://localhost:8080/api/review/query/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
        });
        if (!response.ok) {
            alert("网络不通")
            return null
        }

        const result = await response.json()
        const msgStatus = result.msg.status
        if (msgStatus != Api_Status.SUCCESS && msgStatus != Api_Status.PENDING) {
            alert("请求失败")
            return false
        }

        return result
    } catch (error) {
        console.log(error)
    }
}

export const getCommentReviews = async (target_status, page, token) => {
    if (page <= 0) page = 1

    try {
        const body = getBody(target_status, page, token)
        const response = await fetch("http://localhost:8080/api/review/query/comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
        });
        if (!response.ok) {
            alert("网络不通")
            return null
        }

        const result = await response.json()
        const msgStatus = result.msg.status
        if (msgStatus != Api_Status.SUCCESS && msgStatus != Api_Status.PENDING) {
            alert("请求失败")
            return false
        }

        return result
    } catch (error) {
        console.log(error)
    }
}

export const getNewCreationReviews = async (token) => {
    try {
        const body = { accessToken: { value: token } }
        const response = await fetch("http://localhost:8080/api/review/query/new/creation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
        });
        if (!response.ok) {
            alert("网络不通")
            return null
        }

        const result = await response.json()
        const msgStatus = result.msg.status
        if (msgStatus != Api_Status.SUCCESS && msgStatus != Api_Status.PENDING) {
            alert("请求失败")
            return false
        }

        return result
    } catch (error) {
        console.log(error)
    }
}

export const getNewUserReviews = async (token) => {
    try {
        const body = { accessToken: { value: token } }
        const response = await fetch("http://localhost:8080/api/review/query/new/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
        });
        if (!response.ok) {
            alert("网络不通")
            return null
        }

        const result = await response.json()
        const msgStatus = result.msg.status
        if (msgStatus != Api_Status.SUCCESS && msgStatus != Api_Status.PENDING) {
            alert("请求失败")
            return false
        }

        return result
    } catch (error) {
        console.log(error)
    }
}

export const getNewCommentReviews = async (token) => {
    try {
        const body = { accessToken: { value: token } }
        const response = await fetch("http://localhost:8080/api/review/query/new/comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
        });
        if (!response.ok) {
            alert("网络不通")
            return null
        }

        const result = await response.json()
        const msgStatus = result.msg.status
        if (msgStatus != Api_Status.SUCCESS && msgStatus != Api_Status.PENDING) {
            alert("请求失败")
            return false
        }

        return result
    } catch (error) {
        console.log(error)
    }
}

export const updateReview = async (body) => {
    try {
        const response = await fetch("http://localhost:8080/api/review/update", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        if (!response.ok) {
            alert("网络不通")
            return false;
        }

        const result = await response.json()
        const { status } = result.msg
        if (status != Api_Status.SUCCESS && status != Api_Status.PENDING) {
            alert("未成功")
            console.log(result)
            return false;
        }
        return true;
    } catch (error) {
        console.log(error)
        return false
    }
}
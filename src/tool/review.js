export const Status = Object.freeze({
    CREATION: "CREATION",
    USER: "USER",
    COMMENT: "COMMENT",
});

export const reportInfo = async (target_type, target_id, detail) => {
    try {
        console.log("d11etail")
        if (detail.trim().length <= 0) {
            console.log("detail")
            return null
        }
        let Type = ""
        switch (target_type) {
            case Status.CREATION:
                Type = Status.CREATION
            case Status.USER:
                Type = Status.USER
            case Status.COMMENT:
                Type = Status.COMMENT
        }
        if (Type == "") {
            console.log(`error: target_type ${target_type} is not true`)
            return null
        }

        const body = {
            new: {
                targetId: target_id,
                targetType: Type,
                msg: detail,
            }
        }
        const response = await fetch("http://localhost:8080/api/review", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),  // 将表单数据作为 JSON 发送
        });
        if (!response.ok) {
            console.log(response.error)
            return null
        }

        const result = await response.json()
        const status = result.msg.status
        if (status != Api_Status.SUCCESS && status != Api_Status.PENDING) return false

        console.log(result)

        return result
    } catch (error) {
        console.log(error)
    }
}
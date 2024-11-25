export enum USER_ACTION_TYPES {
    SIGN_IN_WITH_EMAIL_START = "user/SIGN_IN_WITH_EMAIL_START",
    SIGN_IN_WITH_EMAIL_SUCCESS = "user/SIGN_IN_WITH_EMAIL_SUCCESS",
    SIGN_IN_WITH_EMAIL_FAILURE = "user/SIGN_IN_WITH_EMAIL_FAILURE",
    
    SIGN_UP_WITH_EMAIL_START = "user/SIGN_UP_WITH_EMAIL_START",
    SIGN_UP_WITH_EMAIL_SUCCESS = "user/SIGN_UP_WITH_EMAIL_SUCCESS",
    SIGN_UP_WITH_EMAIL_FAILURE = "user/SIGN_UP_WITH_EMAIL_FAILURE",
    
    FETCH_USER_START = "user/FETCH_USER_START",
    FETCH_USER_SUCCESS = "user/FETCH_USER_SUCCESS",
    FETCH_USER_FAILURE = "user/FETCH_USER_FAILURE",
    AUTO_SIGN_IN_START = "user/AUTO_SIGN_IN_START",

    SIGN_OUT_START = "/user/SIGN_OUT_START",
    SIGN_OUT_SUCCESS = "/user/SIGN_OUT_SUCCESS",
}

export interface UserCredentials {
    username: string;  // 用户名，类型为 string，默认为可选
    password: string;  // 密码，类型为 string，默认为可选
    email?: string;     // 邮箱，类型为 string，默认为可选
}

export interface UserDefault {
    user_uuid: string;  // 用户 UUID，类型为 string，默认为可选
    user_name: string;  // 用户名，类型为 string，默认为可选
}

export interface UserLogin {
    user_default: UserDefault;  // 可选字段，类型为 UserDefault
    user_avator: string;        // 可选字段，类型为 string
}
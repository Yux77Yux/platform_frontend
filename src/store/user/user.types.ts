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
    username: string 
    password: string
    email?: string
}

export interface UserDefault{
    userUuid : string
    userName?: string
    userAvator?: string
}
import { AnyAction } from 'redux-saga';
import {
    signInWithEmailSuccess,
    signInWithEmailFailure,
    signUpWithEmailSuccess,
    signUpWithEmailFailure,
    signOutSuccess,
    signOutFailure,
    fetchUserSuccess,
    fetchUserFailure,
} from './user.actions';
import { UserIncidental } from './user.types';
import { hintMerge } from '../../utils/hint';

export interface UserState {
    readonly hint: string,
    readonly userActive: UserIncidental | null,
    readonly error: Error | null,
}

const USER_INITIAL_STATUS: UserState = {
    hint: "",
    userActive: null,
    error: null,
}

export const userReducer = (state = USER_INITIAL_STATUS, action = {} as AnyAction) => {
    if (signInWithEmailSuccess.match(action)) {
        return {
            ...state,
            hint: "",
            userActive: action.payload,
            error: null,
        }
    }

    if (signUpWithEmailSuccess.match(action)) {
        hintMerge("注册成功！")

        return {
            ...state,
            hint: "",
            error: null,
        }
    }

    if (signOutSuccess.match(action)) {
        return {
            ...state,
            hint: "",
            userActive: null,
            error: null,
        }
    }

    if (fetchUserSuccess.match(action)) {
        return {
            ...state,
            hint: "",
            userActive: action.payload,
            error: null,
        }
    }

    if (signInWithEmailFailure.match(action)) {
        return {
            ...state,
            hint: action.payload.message,
            userActive: null,
            error: action.payload,
        }
    }

    if (signUpWithEmailFailure.match(action)) {
        return {
            ...state,
            hint: "",
        }
    }

    if (signOutFailure.match(action)) {
        hintMerge(action.payload);

        return {
            ...state,
            hint: "",
        }
    }

    if (fetchUserFailure.match(action)) {
        return {
            ...state,
            hint: action.payload.message,
            userActive: null,
            error: action.payload,
        }
    }

    return state;
}
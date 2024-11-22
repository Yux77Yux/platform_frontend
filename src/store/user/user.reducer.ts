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
import { UserDefault } from './user.types';

export interface UserState {
    readonly userActive: UserDefault | null,
    readonly error: Error | null,
}

const USER_INITIAL_STATUS: UserState = {
    userActive: null,
    error: null,
}

export const userReducer = (state = USER_INITIAL_STATUS, action = {} as AnyAction) => {
    if (signInWithEmailSuccess.match(action)) {
        return {
            ...state,
            userActive: action.payload,
            error: null,
        }
    }

    if (signUpWithEmailSuccess.match(action)) {
        return {
            ...state,
            error: null,
        }
    }

    if (signOutSuccess.match(action)) {
        return {
            ...state,
            userActive: null,
            error: null,
        }
    }

    if (fetchUserSuccess.match(action)) {
        return {
            ...state,
            userActive: action.payload,
            error: null,
        }
    }

    if (signInWithEmailFailure.match(action)) {
        return {
            ...state,
            userActive: null,
            error: action.payload,
        }
    }

    if (signUpWithEmailFailure.match(action)) {
        return {
            ...state,
        }
    }

    if (signOutFailure.match(action)) {
        return {
            ...state,
        }
    }

    if (fetchUserFailure.match(action)) {
        return {
            ...state,
            userActive: null,
            error: action.payload,
        }
    }

    return state;
}
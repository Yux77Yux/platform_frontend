import {
    withMatcher,
    createAction,
    Action,
    ActionWithPayload,
} from '../../utils/reducer/reducer.utils';

import {
    USER_ACTION_TYPES,
    UsernameAndPassword,
    UserIncidental,
} from './user.types';

export type SignInWithEmailStart = ActionWithPayload<USER_ACTION_TYPES.SIGN_IN_WITH_EMAIL_START, UsernameAndPassword>;
export type SignInWithEmailSuccess = ActionWithPayload<USER_ACTION_TYPES.SIGN_IN_WITH_EMAIL_SUCCESS, UserIncidental>;
export type SignInWithEmailFailure = ActionWithPayload<USER_ACTION_TYPES.SIGN_IN_WITH_EMAIL_FAILURE, Error>;

export type SignUpWithEmailStart = ActionWithPayload<USER_ACTION_TYPES.SIGN_UP_WITH_EMAIL_START, UsernameAndPassword>;
export type SignUpWithEmailSuccess = ActionWithPayload<USER_ACTION_TYPES.SIGN_UP_WITH_EMAIL_SUCCESS, string>;
export type SignUpWithEmailFailure = ActionWithPayload<USER_ACTION_TYPES.SIGN_UP_WITH_EMAIL_FAILURE, string>;

export type SignOutStart = Action<USER_ACTION_TYPES.SIGN_OUT_START>;
export type SignOutSuccess = ActionWithPayload<USER_ACTION_TYPES.SIGN_OUT_SUCCESS, string>;
export type SignOutFailure = ActionWithPayload<USER_ACTION_TYPES.SIGN_OUT_SUCCESS, string>;

export type FetchUserStart = Action<USER_ACTION_TYPES.FETCH_USER_START>;
export type FetchUserSuccess = ActionWithPayload<USER_ACTION_TYPES.FETCH_USER_SUCCESS, UserIncidental>;
export type FetchUserFailure = ActionWithPayload<USER_ACTION_TYPES.FETCH_USER_FAILURE, Error>;

export type AutoSignInStart = ActionWithPayload<USER_ACTION_TYPES.AUTO_SIGN_IN_START,string>;

//Sign-In
export const signInWithEmailStart = (payload: UsernameAndPassword): SignInWithEmailStart =>
    createAction(USER_ACTION_TYPES.SIGN_IN_WITH_EMAIL_START, payload)

export const signInWithEmailSuccess = withMatcher(
    (payload: UserIncidental): SignInWithEmailSuccess =>
        createAction(USER_ACTION_TYPES.SIGN_IN_WITH_EMAIL_SUCCESS, payload)
)

export const signInWithEmailFailure = withMatcher(
    (error: Error): SignInWithEmailFailure =>
        createAction(USER_ACTION_TYPES.SIGN_IN_WITH_EMAIL_FAILURE, error)
)

//Sign-Up
export const signUpWithEmailStart = (payload: UsernameAndPassword): SignUpWithEmailStart =>
    createAction(USER_ACTION_TYPES.SIGN_UP_WITH_EMAIL_START, payload)

export const signUpWithEmailSuccess = withMatcher(
    (hint: string): SignUpWithEmailSuccess =>
        createAction(USER_ACTION_TYPES.SIGN_UP_WITH_EMAIL_SUCCESS, hint)
)

export const signUpWithEmailFailure = withMatcher(
    (hint: string): SignUpWithEmailFailure =>
        createAction(USER_ACTION_TYPES.SIGN_UP_WITH_EMAIL_FAILURE, hint)
)

//Sign-Out
export const signOutStart = (): SignOutStart =>
    createAction(USER_ACTION_TYPES.SIGN_OUT_START, null)

export const signOutSuccess = withMatcher(
    (payload: string): SignOutSuccess =>
        createAction(USER_ACTION_TYPES.SIGN_OUT_SUCCESS, payload)
)

export const signOutFailure = withMatcher(
    (payload: string): SignOutFailure =>
        createAction(USER_ACTION_TYPES.SIGN_OUT_SUCCESS, payload)
)

//fetch-User
export const fetchUserStart = (): FetchUserStart =>
    createAction(USER_ACTION_TYPES.FETCH_USER_START, null)

export const fetchUserSuccess = withMatcher(
    (payload: UserIncidental): FetchUserSuccess =>
        createAction(USER_ACTION_TYPES.FETCH_USER_SUCCESS, payload)
)

export const fetchUserFailure = withMatcher(
    (payload: Error): FetchUserFailure =>
        createAction(USER_ACTION_TYPES.FETCH_USER_FAILURE, payload)
)

//autoSignIn
export const autoSignInStart = (payload:string): AutoSignInStart =>
    createAction(USER_ACTION_TYPES.AUTO_SIGN_IN_START, payload)

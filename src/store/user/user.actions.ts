import {
    withMatcher,
    createAction,
} from '../reducer.types';

import {
    USER_ACTION_TYPES,
    UserCredentials,
    UserDefault,
} from './user.types';

function createAsyncAction<T, S, F>(
    startType: string,
    successType: string,
    failureType: string
) {
    return {
        start: (payload: T) => createAction(startType, payload),
        success: (payload: S) => createAction(successType, payload),
        failure: (error: F) => createAction(failureType, error),
    };
}

//Sign-In
const signInActions = createAsyncAction<UserCredentials, UserDefault, Error>(
    USER_ACTION_TYPES.SIGN_IN_WITH_EMAIL_START,
    USER_ACTION_TYPES.SIGN_IN_WITH_EMAIL_SUCCESS,
    USER_ACTION_TYPES.SIGN_IN_WITH_EMAIL_FAILURE
);
export const signInWithEmailStart = signInActions.start
export const signInWithEmailSuccess = withMatcher(signInActions.success)
export const signInWithEmailFailure = withMatcher(signInActions.failure)

//Sign-Up
const signUpActions = createAsyncAction<UserCredentials, string, string>(
    USER_ACTION_TYPES.SIGN_UP_WITH_EMAIL_START,
    USER_ACTION_TYPES.SIGN_UP_WITH_EMAIL_SUCCESS,
    USER_ACTION_TYPES.SIGN_UP_WITH_EMAIL_FAILURE
);
export const signUpWithEmailStart = signUpActions.start
export const signUpWithEmailSuccess = withMatcher(signUpActions.success)
export const signUpWithEmailFailure = withMatcher(signUpActions.failure)

//Sign-Out
const signOutActions = createAsyncAction<null, string, string>(
    USER_ACTION_TYPES.SIGN_OUT_START,
    USER_ACTION_TYPES.SIGN_OUT_SUCCESS,
    USER_ACTION_TYPES.SIGN_OUT_SUCCESS
);
export const signOutStart = () =>signOutActions.start
export const signOutSuccess = withMatcher(signOutActions.success)
export const signOutFailure = withMatcher(signOutActions.failure)

//fetch-User
const fetchUserActions = createAsyncAction<null, string, string>(
    USER_ACTION_TYPES.FETCH_USER_START,
    USER_ACTION_TYPES.FETCH_USER_SUCCESS,
    USER_ACTION_TYPES.FETCH_USER_FAILURE
);
export const fetchUserStart = () =>fetchUserActions.start
export const fetchUserSuccess = withMatcher(fetchUserActions.success)
export const fetchUserFailure = withMatcher(fetchUserActions.failure)

//autoSignIn
export const autoSignInStart = (payload: string) =>
    createAction(USER_ACTION_TYPES.AUTO_SIGN_IN_START, payload)

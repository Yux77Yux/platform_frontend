import { createSelector } from 'reselect';

import { UserState } from './user.reducer';
import { RootState } from '../store';

export const selectUserReducer = (state: RootState) => state.user;

export const getUserSelector = createSelector(
    [selectUserReducer],
    (reducerState: UserState) => reducerState.userActive
)

export const getErrorSelector = createSelector(
    [selectUserReducer],
    (reducerState: UserState) => reducerState.error
)

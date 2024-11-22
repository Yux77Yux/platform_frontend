/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { AnyAction } from "redux-saga";

export type Action<T extends string> = { type: T };
export type ActionWithPayload<T extends string, P> = Action<T> & { payload: P };

export function createAction<T extends string>(type: T, payload: null): Action<T>;
export function createAction<T extends string, P>(type: T, payload: P): ActionWithPayload<T, P>;
export function createAction<T extends string, P>(type: T, payload: P): ActionWithPayload<T, P> {
    return { type, payload };
}

type matchAction<T extends (...args: any[]) => AnyAction> = T & {
    type: ReturnType<T>['type'],
    match(action: AnyAction): action is ReturnType<T>
}

export function withMatcher<AC extends () => AnyAction & { type: string }>(actionCreator: AC): matchAction<AC>;
export function withMatcher<AC extends (...args: any[]) => AnyAction & { type: string }>(actionCreator: AC): matchAction<AC>;
export function withMatcher(actionCreator: Function) {
    const type = actionCreator().type;
    return Object.assign(actionCreator, {
        type,
        match(action: AnyAction) {
            return action.type === type;
        }
    });
}
import { compose, createStore, applyMiddleware, Middleware, StoreEnhancer, Store } from "redux";
import logger from 'redux-logger';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';

import { rootSaga } from "./root-saga";
import { rootReducer } from "./rootReducer";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

export type RootState = ReturnType<typeof rootReducer>;

const sagaMiddleware: SagaMiddleware = createSagaMiddleware()

const middleWares = [process.env.NODE_ENV !== 'production' && logger, sagaMiddleware].filter(Boolean) as Middleware[];

const composedEnhancer = (
    process.env.NODE_ENV !== 'production' &&
    typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const composedEnhancers: StoreEnhancer = composedEnhancer(applyMiddleware(...middleWares));

export const store: Store = createStore(rootReducer, undefined, composedEnhancers);

sagaMiddleware.run(rootSaga);

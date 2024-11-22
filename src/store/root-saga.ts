import {
    call,
    all
} from 'typed-redux-saga';

import { userSaga } from './user/user.saga';

export function* rootSaga(){
    yield* all([
        call(userSaga),
    ])
}
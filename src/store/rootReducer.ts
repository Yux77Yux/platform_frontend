import { combineReducers } from "redux";

import { articlesReducer } from './articles/articles.reducer';
import { userReducer } from './user/user.reducer';


export const rootReducer = combineReducers({
    articles: articlesReducer,
    user: userReducer,
})
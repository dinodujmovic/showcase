import { ActionReducerMap, createFeatureSelector } from "@ngrx/store";

// import * as actions from './actions';
import * as authReducers from "./reducers/auth.reducers";
import { AuthState } from "./reducers/auth.reducers";
import * as postReducers from "./reducers/post.reducers";
import { PostState } from "./reducers/post.reducers";
import * as userReducers from "./reducers/user.reducers";
import { UserState } from "./reducers/user.reducers";

// export type Action = actions.AuthAction;

export interface AppState {
    auth: authReducers.AuthState;
    user: userReducers.UserState;
    post: postReducers.PostState;
}

// export const reducers: ActionReducerMap<AppState> = {
export const reducers: any = {
    auth: authReducers.reducer,
    user: userReducers.reducer,
    post: postReducers.reducer,
};

export const selectAuthState = createFeatureSelector<AuthState>("auth");
export const selectUserState = createFeatureSelector<UserState>("user");
export const selectPostState = createFeatureSelector<PostState>("post");

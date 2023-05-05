import { Action } from "@ngrx/store";

import { Credentials, LogInContext, SignUpContext } from "../../core/model/auth.model";
import { ScError } from "../../core/model/error.model";
import { User } from "../../core/model/user.model";
import { DataAction } from "./data.actions";

// ===========================
// Authenticated User Actions
// ===========================

export enum AuthActionTypes {
    LOGIN = "[Auth] Login",
    LOGIN_SUCCESS = "[Auth] Login Success",
    LOGIN_FAILURE = "[Auth] Login Failure",
    LOGOUT = "[Auth] Logout",
    SIGNUP = "[Auth] Signup",
    SIGNUP_SUCCESS = "[Auth] Signup Success",
    SIGNUP_FAILURE = "[Auth] Signup Failure",
    GET_ME = "[Auth] Get Me",
    GET_ME_SUCCESS = "[Auth] Get Me Success",
    GET_ME_FAILURE = "[Auth] Get Me Failure",
    SET_AVATAR = "[Auth] Set Avatar",
    SET_AVATAR_SUCCESS = "[Auth] Set Avatar Success",
    SET_AVATAR_FAILURE = "[Auth] Set Avatar Failure"
}

export abstract class AuthAction implements DataAction<Credentials> {
    readonly type!: string;

    constructor(public readonly payload: Credentials) {
    }
}

export class LogIn implements Action {
    readonly type = AuthActionTypes.LOGIN;

    constructor(public readonly payload: LogInContext) {
    }
}

export class LogInSuccess implements Action {
    readonly type = AuthActionTypes.LOGIN_SUCCESS;

    constructor(public readonly payload: Credentials) {
    }
}

export class LogInFailure implements Action {
    readonly type = AuthActionTypes.LOGIN_FAILURE;

    constructor(public readonly payload: ScError) {
    }
}

export class Logout implements Action {
    readonly type = AuthActionTypes.LOGOUT;
}

export class SignUp implements Action {
    readonly type = AuthActionTypes.SIGNUP;

    constructor(public payload: SignUpContext) {
    }
}

export class SignUpSuccess implements Action {
    readonly type = AuthActionTypes.SIGNUP_SUCCESS;

    constructor(public payload: Credentials) {
    }
}

export class SignUpFailure implements Action {
    readonly type = AuthActionTypes.SIGNUP_FAILURE;

    constructor(public payload: ScError) {
    }
}

export class GetMe implements Action {
    readonly type = AuthActionTypes.GET_ME;
}

export class GetMeSuccess implements Action {
    readonly type = AuthActionTypes.GET_ME_SUCCESS;

    constructor(public payload: Credentials) {
    }
}

export class GetMeFailure implements Action {
    readonly type = AuthActionTypes.GET_ME_FAILURE;

    constructor(public payload: ScError) {
    }
}

export class SetAvatar implements Action {
    readonly type = AuthActionTypes.SET_AVATAR;

    constructor(public payload: File) {
    }
}

export class SetAvatarSuccess implements Action {
    readonly type = AuthActionTypes.SET_AVATAR_SUCCESS;

    constructor(public payload: User) {
    }
}

export class SetAvatarFailure implements Action {
    readonly type = AuthActionTypes.SET_AVATAR_FAILURE;

    constructor(public payload: ScError) {
    }
}

export type AllAuthActions =
  | LogIn
  | LogInSuccess
  | LogInFailure
  | Logout
  | SignUp
  | SignUpSuccess
  | SignUpFailure
  | GetMe
  | GetMeSuccess
  | GetMeFailure
  | SetAvatar
  | SetAvatarSuccess
  | SetAvatarFailure;

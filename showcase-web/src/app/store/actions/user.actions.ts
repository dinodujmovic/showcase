import { Action } from "@ngrx/store";

import { ScError } from "../../core/model/error.model";
import { User } from "../../core/model/user.model";

export enum UserActionTypes {
    GET_USERS = "[User] Get Users",
    GET_USERS_SUCCESS = "[User] Get Users Success",
    GET_USERS_FAILURE = "[User] Get Users Failure",
    DELETE_USER = "[User] Delete User",
    DELETE_USER_SUCCESS = "[User] Delete User Success",
    DELETE_USER_FAILURE = "[User] Delete User Failure"
}

export class GetUsers implements Action {
    readonly type = UserActionTypes.GET_USERS;
}

export class GetUsersSuccess implements Action {
    readonly type = UserActionTypes.GET_USERS_SUCCESS;

    constructor(public readonly payload: User[]) {
    }
}

export class GetUsersFailure implements Action {
    readonly type = UserActionTypes.GET_USERS_FAILURE;

    constructor(public readonly payload: ScError) {
    }
}

export class DeleteUser implements Action {
    readonly type = UserActionTypes.DELETE_USER;

    constructor(public readonly payload: string) {
    }
}

export class DeleteUserSuccess implements Action {
    readonly type = UserActionTypes.DELETE_USER_SUCCESS;

    constructor(public readonly payload: string) {
    }
}

export class DeleteUserFailure implements Action {
    readonly type = UserActionTypes.DELETE_USER_FAILURE;

    constructor(public readonly payload: ScError) {
    }
}

export type AllUserActions =
  | GetUsers
  | GetUsersSuccess
  | GetUsersFailure
  | DeleteUser
  | DeleteUserSuccess
  | DeleteUserFailure;

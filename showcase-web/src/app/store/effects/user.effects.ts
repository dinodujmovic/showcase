import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ToastrService } from "ngx-toastr";
import { Observable, of } from "rxjs";
import {
    catchError, map, switchMap, tap
} from "rxjs/operators";

import { ScError } from "../../core/model/error.model";
import { User } from "../../core/model/user.model";
import { UserService } from "../../core/services/user.service";
import * as UserAction from "../actions";
import { UserActionTypes } from "../actions";

@Injectable()
export class UserEffects {
    constructor(
        private actions: Actions,
        private userService: UserService,
        private toastrService: ToastrService
    ) {
    }

    getUsers: Observable<any> = createEffect(() => this.actions
        .pipe(
            ofType(UserActionTypes.GET_USERS),
            map((action: UserAction.GetUsers) => action),
            switchMap((action) => this.userService.getUsers()
                .pipe(
                    map((users: User[]) => new UserAction.GetUsersSuccess(users)),
                    catchError((error: ScError) => of(new UserAction.GetUsersFailure(error)))
                ))
        ));

    getUsersSuccess: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(UserActionTypes.GET_USERS_SUCCESS),
        map((action: UserAction.GetUsersSuccess) => action.payload),
        tap((users: User[]) => {
        })
    ), { dispatch: false });

    getUsersFailure: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(UserActionTypes.GET_USERS_FAILURE),
        map((action: UserAction.GetUsersFailure) => action.payload),
        tap((error: ScError) => {
            this.toastrService.error(`${error.message}`, `${error.statusCode} (${error.status})`);
        })
    ), { dispatch: false });

    deleteUser: Observable<any> = createEffect(() => this.actions
        .pipe(
            ofType(UserActionTypes.DELETE_USER),
            map((action: UserAction.DeleteUser) => action.payload),
            switchMap((payload: string) => this.userService.deleteUser(payload)
                .pipe(
                    map((success: boolean) => new UserAction.DeleteUserSuccess(payload)),
                    catchError((error: ScError) => of(new UserAction.DeleteUserFailure(error)))
                ))
        ));

    deleteUserSuccess: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(UserActionTypes.DELETE_USER_SUCCESS),
        map((action: UserAction.DeleteUserSuccess) => action.payload),
        tap((boolean) => {
            this.toastrService.success("User deleted.");
        })
    ), { dispatch: false });

    deleteUserFailure: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(UserActionTypes.DELETE_USER_FAILURE),
        map((action: UserAction.DeleteUserFailure) => action.payload),
        tap((error: ScError) => {
            this.toastrService.error(`${error.message}`, `${error.statusCode} (${error.status})`);
        })
    ), { dispatch: false });
}

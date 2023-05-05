import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ToastrService } from "ngx-toastr";
import { Observable, of } from "rxjs";
import {
    catchError, map, switchMap, tap
} from "rxjs/operators";

import { Credentials } from "../../core/model/auth.model";
import { ScError } from "../../core/model/error.model";
import { User } from "../../core/model/user.model";
import { AuthenticationService } from "../../core/services/authentication.service";
import { CredentialsService } from "../../core/services/credentials.service";
import { UserService } from "../../core/services/user.service";
import * as AuthAction from "../actions";
import { AuthActionTypes } from "../actions";

@Injectable()
export class AuthEffects {
    constructor(
        private actions: Actions,
        private authService: AuthenticationService,
        private userService: UserService,
        private toastrService: ToastrService,
        private credentialsService: CredentialsService,
        private router: Router,
    ) {
    }

    login: Observable<any> = createEffect(() => this.actions
        .pipe(
            ofType(AuthActionTypes.LOGIN),
            map((action: AuthAction.LogIn) => action.payload),
            switchMap((payload) => this.authService.login(payload)
                .pipe(
                    map((credentials: Credentials) => new AuthAction.LogInSuccess(credentials)),
                    catchError((error: ScError) => of(new AuthAction.LogInFailure(error)))
                ))
        ));

    loginSuccess: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(AuthActionTypes.LOGIN_SUCCESS),
        map((action: AuthAction.LogInSuccess) => action.payload),
        tap((credentials: Credentials) => {
            this.credentialsService.setCredentials(credentials, true);
            this.router.navigateByUrl("/");
            this.toastrService.success("Logged in");
        })
    ), { dispatch: false });

    loginFailure: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(AuthActionTypes.LOGIN_FAILURE),
        map((action: AuthAction.LogInFailure) => action.payload),
        tap((error: ScError) => {
            this.toastrService.error("Wrong username or password.", `${error.statusCode} (${error.status})`);
        })
    ), { dispatch: false });

    logout: Observable<any> = createEffect(() => this.actions
        .pipe(
            ofType(AuthActionTypes.LOGOUT),
            tap(() => {
                this.authService.logout();
                this.toastrService.success("Logged out");
            })
        ), { dispatch: false });

    signUp: Observable<any> = createEffect(() => this.actions
        .pipe(
            ofType(AuthActionTypes.SIGNUP),
            map((action: AuthAction.SignUp) => action.payload),
            switchMap((payload) => this.authService.signup(payload)
                .pipe(
                    map((credentials: Credentials) => new AuthAction.SignUpSuccess(credentials)),
                    catchError((error: ScError) => of(new AuthAction.SignUpFailure(error)))
                ))
        ));

    signUpSuccess: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(AuthActionTypes.SIGNUP_SUCCESS),
        map((action: AuthAction.SignUpSuccess) => action.payload),
        tap((credentials: Credentials) => {
            this.credentialsService.setCredentials(credentials, true);
            this.router.navigateByUrl("/");
            this.toastrService.success("Registered and logged in");
        })
    ), { dispatch: false });

    signUpFailure: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(AuthActionTypes.SIGNUP_FAILURE),
        map((action: AuthAction.SignUpFailure) => action.payload),
        tap((error: ScError) => {
            this.toastrService.error(error.message, `${error.statusCode} (${error.status})`);
        })
    ), { dispatch: false });

    me: Observable<any> = createEffect(() => this.actions
        .pipe(
            ofType(AuthActionTypes.GET_ME),
            switchMap(() => this.authService.me()
                .pipe(
                    map((credentials: Credentials) => new AuthAction.GetMeSuccess(credentials)),
                    catchError((error: ScError) => of(new AuthAction.GetMeFailure(error)))
                ))
        ));

    updateProfileImage: Observable<any> = createEffect(() => this.actions
        .pipe(
            ofType(AuthActionTypes.SET_AVATAR),
            map((action: AuthAction.SetAvatar) => action.payload),
            switchMap((payload) => this.userService.setAvatar(payload)
                .pipe(
                    map((user: User) => new AuthAction.SetAvatarSuccess(user)),
                    catchError((error: ScError) => of(new AuthAction.SetAvatarFailure(error)))
                ))
        ));

    updateProfileImageSuccess: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(AuthActionTypes.SET_AVATAR_SUCCESS),
        tap(() => {
            this.toastrService.success("Avatar changed");
        })
    ), { dispatch: false });

    updateProfileImageFailure: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(AuthActionTypes.SET_AVATAR_FAILURE),
        map((action: AuthAction.SetAvatarFailure) => action.payload),
        tap((error: ScError) => {
            this.toastrService.error(error.message, `${error.statusCode} (${error.status})`);
        })
    ), { dispatch: false });
}

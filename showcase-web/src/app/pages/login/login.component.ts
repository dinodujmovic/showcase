import { Component, OnDestroy, OnInit } from "@angular/core";
import {
    FormBuilder, FormControl, FormGroup, Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { SubSink } from "subsink";

import { LogInContext } from "../../core/model/auth.model";
import { AppState, selectAuthState } from "../../store";
import * as AuthAction from "../../store/actions";
import { AuthState } from "../../store/reducers/auth.reducers";

@Component({
    selector: "sc-login",
    templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit, OnDestroy {
    public loginForm!: FormGroup;
    public loginFormSubmitted!: boolean;

    private subs = new SubSink();
    private getState: Observable<any>;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private store: Store<AppState>
    ) {
        this.getState = this.store.select(selectAuthState);

        this.subs.sink = this.getState
            .pipe(take(1))
            .subscribe((state: AuthState) => {
                if (state.isAuthenticated) {
                    this.store.dispatch(new AuthAction.Logout());
                }
            });
    }

    ngOnInit() {
        this.loginForm = this.fb.group({
            username: new FormControl("", Validators.required),
            password: new FormControl("", Validators.required)
        });
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    submit(form: FormGroup) {
        this.loginFormSubmitted = true;

        if (form.invalid) {
            return;
        }

        const logInContext: LogInContext = {
            username: form.value.username,
            password: form.value.password
        };

        this.store.dispatch(new AuthAction.LogIn(logInContext));
    }
}

import { Component, OnDestroy, OnInit } from "@angular/core";
import {
    Form, FormBuilder, FormGroup, Validators
} from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { SubSink } from "subsink";

import { TextValidator } from "../../shared/validators/text.validator";
import { AppState, selectAuthState } from "../../store";
import * as AuthAction from "../../store/actions";
import { AuthState } from "../../store/reducers/auth.reducers";

@Component({
    selector: "sc-signup",
    templateUrl: "./signup.component.html"
})
export class SignUpComponent implements OnInit, OnDestroy {
    public registrationForm!: FormGroup;
    public registerFormSubmitted = false;
    public registrationInProgress = false;

    private subs = new SubSink();
    private getState: Observable<any>;

    constructor(
        private fb: FormBuilder,
        private store: Store<AppState>
    ) {
        this.getState = this.store.select(selectAuthState);

        this.subs.sink = this.getState
            .subscribe((state: AuthState) => {
                this.registrationInProgress = state.loading;
            });
    }

    ngOnInit() {
        this.registrationForm = this.fb.group({
            email: ["", [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+")]],
            username: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
            passwordGroup: this.fb.group({
                password: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
                matchingPassword: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(15)]]
            }, { validator: TextValidator.passwordMatcher() })
        });
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    register(form: FormGroup) {
        this.registerFormSubmitted = true;

        if (form.invalid || this.registrationInProgress) {
            return;
        }

        const account = {
            username: form.value.username,
            email: form.value.email,
            password: form.value.passwordGroup.password,
            matchingPassword: form.value.passwordGroup.matchingPassword
        };

        this.store.dispatch(new AuthAction.SignUp(account));
    }
}

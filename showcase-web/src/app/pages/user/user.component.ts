import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { SubSink } from "subsink";

import { environment } from "../../../environments/environment";
import { User } from "../../core/model/user.model";
import { HelperService } from "../../core/services/helper.service";
import { AppState, selectAuthState, selectUserState } from "../../store";
import * as UserAction from "../../store/actions";
import { AuthState } from "../../store/reducers/auth.reducers";
import { UserState } from "../../store/reducers/user.reducers";

@Component({
    selector: "sc-user",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.scss"]
})
export class UserComponent implements OnInit, OnDestroy {
    private subs = new SubSink();
    private getAuthState: Observable<any>;
    private getUserState: Observable<any>;

    public users!: User[];
    public environment: any = environment;
    public mediaPath: string;

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private helperSerivce: HelperService
    ) {
        this.mediaPath = this.helperSerivce.getMediaPath();
        this.getAuthState = this.store.select(selectAuthState);
        this.getUserState = this.store.select(selectUserState);

        this.subs.sink = this.getAuthState
            .subscribe((state: AuthState) => {
                if (!state.isAuthenticated) {
                    this.router.navigate(["/"]);
                }
            });

        this.subs.sink = this.getUserState
            .subscribe((state: UserState) => {
                this.users = state.users;
            });
    }

    ngOnInit(): void {
        this.store.dispatch(new UserAction.GetUsers());
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    deleteUser(userId: string) {
        // eslint-disable-next-line no-alert
        const positive = window.confirm("Are you sure ?");

        if (positive) {
            this.store.dispatch(new UserAction.DeleteUser(userId));
        }
    }
}

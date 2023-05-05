import { Component, OnDestroy } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { SubSink } from "subsink";

import { PostUploadModalComponent } from "../../../pages/post/post-upload-modal/post-upload-modal.component";
import { AppState, selectAuthState } from "../../../store";
import * as AuthAction from "../../../store/actions";
import { AuthState } from "../../../store/reducers/auth.reducers";
import { User } from "../../model/user.model";

@Component({
    selector: "sc-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnDestroy {
    private subs = new SubSink();
    private getState: Observable<any>;

    public isAuthenticated!: boolean;
    public user!: User | null;

    constructor(
        private store: Store<AppState>,
        private modalService: NgbModal
    ) {
        this.getState = this.store.select(selectAuthState);

        this.subs.sink = this.getState
            .subscribe((state: AuthState) => {
                this.isAuthenticated = state.isAuthenticated;
                this.user = state.user;
            });
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    logout() {
        this.store.dispatch(new AuthAction.Logout());
    }

    createPost() {
        this.modalService.open(PostUploadModalComponent);
    }
}

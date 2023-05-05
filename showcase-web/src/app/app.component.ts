import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";

import { AppState } from "./store";
import * as AuthAction from "./store/actions";

@Component({
    selector: "sc-root",
    template: `
        <sc-navbar></sc-navbar>
        <div class="container">
            <router-outlet></router-outlet>
        </div>
    `
})
export class AppComponent implements OnInit {
    constructor(private store: Store<AppState>) {
    }

    ngOnInit(): void {
        this.store.dispatch(new AuthAction.GetMe());
    }
}

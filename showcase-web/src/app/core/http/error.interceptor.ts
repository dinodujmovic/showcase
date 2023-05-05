import {
    HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { AppState } from "../../store";
import * as AuthAction from "../../store/actions";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private store!: Store<AppState>;

    constructor(
        private injector: Injector,
        private router: Router
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.store = this.injector.get(Store);

        const currentRoute: string = this.router.url;

        return next.handle(request)
            .pipe(catchError((response: any) => {
                const requestURL = new URL(request.url);
                if (response instanceof HttpErrorResponse
          && response.status === 401
          && requestURL.pathname !== "/auth/login"
          && requestURL.pathname !== "/auth/me") {
                    this.store.dispatch(new AuthAction.Logout());
                }
                return throwError(response);
            }));
    }
}

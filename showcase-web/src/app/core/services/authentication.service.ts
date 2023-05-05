import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, flatMap } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { Credentials, LogInContext, SignUpContext } from "../model/auth.model";
import { CredentialsService } from "./credentials.service";
import { ErrorService } from "./error.service";

@Injectable({
    providedIn: "root"
})
export class AuthenticationService {
    constructor(
        private http: HttpClient,
        private credentialsService: CredentialsService,
        private errorService: ErrorService
    ) {
    }

    /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
    login(context: LogInContext): Observable<Credentials> {
        return this.http.post<Credentials>(`${environment.serverUrl}/auth/login`, context)
            .pipe(
                // flatMap((credentials: Credentials) => of(credentials)),
                catchError((errorResponse: HttpErrorResponse) => throwError(() => this.errorService.handleError(errorResponse.error)))
            );
    }

    me(): Observable<Credentials> {
        return this.http.get<Credentials>(`${environment.serverUrl}/auth/me`)
            .pipe(
                // flatMap((credentials: Credentials) => of(credentials)),
                catchError((errorResponse: HttpErrorResponse) => throwError(() => this.errorService.handleError(errorResponse.error)))
            );
    }

    /**
   * Authenticates the user.
   * @param context The signup parameters.
   * @return The user credentials.
   */
    signup(context: SignUpContext): Observable<Credentials> {
        return this.http.post<Credentials>(`${environment.serverUrl}/users`, context)
            .pipe(
                // flatMap((credentials: Credentials) => of(credentials)),
                catchError((errorResponse: HttpErrorResponse) => throwError(() => this.errorService.handleError(errorResponse.error)))
            );
    }

    /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
    logout(): Observable<boolean> {
        // Customize credentials invalidation here
        this.credentialsService.setCredentials();
        return of(true);
    }
}

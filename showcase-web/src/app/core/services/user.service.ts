import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environment/environment";
import { Observable, of, throwError } from "rxjs";
import { catchError, flatMap } from "rxjs/operators";

import { User } from "../model/user.model";
import { CredentialsService } from "./credentials.service";
import { ErrorService } from "./error.service";

@Injectable({
    providedIn: "root"
})
export class UserService {
    constructor(
        private http: HttpClient,
        private credentialsService: CredentialsService,
        private errorService: ErrorService
    ) {
    }

    getUsers() {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set("Content-Type", "application/json");

        return this.http.get<User[]>(`${environment.serverUrl}/users`, { headers: httpHeaders })
            .pipe(
                catchError((errorResponse: HttpErrorResponse) => throwError(() => this.errorService.handleError(errorResponse.error)))
            );
    }

    deleteUser(userId: string) {
        return this.http.delete<boolean>(`${environment.serverUrl}/users/${userId}`)
            .pipe(
                catchError((errorResponse: HttpErrorResponse) => throwError(() => this.errorService.handleError(errorResponse.error)))
            );
    }

    setAvatar(file: File): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set("Content-Type", "multipart/form-data");
        httpHeaders.set("Accept-Ranges", "bytes");

        const formData = new FormData();
        formData.append("image", file);

        return this.http.post<User>(`${environment.serverUrl}/me/avatar`, formData, { headers: httpHeaders })
            .pipe(
                // flatMap((response: User) => of(response)),
                catchError((errorResponse: HttpErrorResponse) => throwError(() => this.errorService.handleError(errorResponse.error)))
            );
    }
}

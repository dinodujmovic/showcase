import {
    HttpClient, HttpErrorResponse, HttpHeaders, HttpParams
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PostResponse } from "@core/model/post.model";
import { User } from "@core/model/user.model";
import { CredentialsService } from "@core/services/credentials.service";
import { ErrorService } from "@core/services/error.service";
import { environment } from "@environment/environment";
import { Observable, of, throwError } from "rxjs";
import { catchError, flatMap } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class PostService {
    constructor(
        private http: HttpClient,
        private credentialsService: CredentialsService,
        private errorService: ErrorService
    ) {
    }

    getPosts(limit?: number, page?: number) {
        const headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        let params = new HttpParams();
        if (limit) {
            params = params.append("limit", `${limit}`);
        }

        if (page) {
            params = params.append("page", `${page}`);
        }

        return this.http.get<PostResponse>(`${environment.serverUrl}/posts`, { headers, params })
            .pipe(
                catchError((errorResponse: HttpErrorResponse) => throwError(() => this.errorService.handleError(errorResponse.error)))
            );
    }

    uploadPost(file: File, description: string): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set("Content-Type", "multipart/form-data");
        httpHeaders.set("Accept-Ranges", "bytes");

        const formData = new FormData();
        formData.append("video", file);
        formData.append("description", description);

        return this.http.post<User>(`${environment.serverUrl}/posts`, formData, { headers: httpHeaders })
            .pipe(
                catchError((errorResponse: HttpErrorResponse) => throwError(() => this.errorService.handleError(errorResponse.error)))
            );
    }

    deletePost(postId: number): Observable<any> {
        return this.http.delete<boolean>(`${environment.serverUrl}/posts/${postId}`)
            .pipe(
                catchError((errorResponse: HttpErrorResponse) => throwError(() => this.errorService.handleError(errorResponse.error)))
            );
    }
}

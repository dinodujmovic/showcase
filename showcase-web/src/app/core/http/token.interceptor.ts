import {
    HttpEvent,
    HttpInterceptor,
    HttpRequest,
} from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { CredentialsService } from "@core/services/credentials.service";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private injector: Injector,
        private credentialsService: CredentialsService
    ) {
    }

    intercept(request: HttpRequest<any>, next: any): Observable<HttpEvent<any>> {
        this.credentialsService = this.injector.get(CredentialsService);

        let clonedReq;
        const currentRoute: string = this.router.url;
        const { credentials } = this.credentialsService;

        if (credentials && credentials.token && currentRoute !== "/login" && currentRoute !== "/sign-up") {
            clonedReq = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${credentials.token}`
                }
            });
        }

        return next.handle(clonedReq);
    }
}

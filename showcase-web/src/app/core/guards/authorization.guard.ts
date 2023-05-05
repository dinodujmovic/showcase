import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot
} from "@angular/router";
import { CredentialsService } from "@core/services/credentials.service";
import { LoggerService } from "@core/services/logger.service";

@Injectable({
    providedIn: "root"
})
export class AuthorizationGuard implements CanActivate {
    constructor(
        private logger: LoggerService,
        private router: Router,
        private credentialsService: CredentialsService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.credentialsService.isAuthenticated() && this.credentialsService.isAdmin()) {
            return true;
        }

        this.logger.logError("Not authorized, redirecting and adding redirect url...");
        this.router.navigate(["/"]);
        return false;
    }
}

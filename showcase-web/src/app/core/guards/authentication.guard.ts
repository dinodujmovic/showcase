import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot
} from "@angular/router";

import { CredentialsService } from "../services/credentials.service";
import { LoggerService } from "../services/logger.service";

@Injectable({
    providedIn: "root"
})
export class AuthenticationGuard implements CanActivate {
    constructor(
        private logger: LoggerService,
        private router: Router,
        private credentialsService: CredentialsService
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.credentialsService.isAuthenticated()) {
            return true;
        }

        this.logger.logError("Not authenticated, redirecting and adding redirect url...");
        this.router.navigate(["/"]);
        return false;
    }
}

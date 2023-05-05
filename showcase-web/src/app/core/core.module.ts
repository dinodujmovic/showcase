import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule, Optional, SkipSelf } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { NavbarComponent } from "@core/shell/navbar/navbar.component";

import { SharedModule } from "../shared/shared.module";
import { EnsureModuleLoadedOnceGuard } from "./guards/ensure-module-loaded-once.guard";
import { ErrorInterceptor } from "./http/error.interceptor";
import { TokenInterceptor } from "./http/token.interceptor";
import { AuthenticationService } from "./services/authentication.service";
import { CredentialsService } from "./services/credentials.service";

const components = [
    NavbarComponent
];

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        HttpClientModule,
        SharedModule
    ],
    exports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule,
        ...components
    ],
    declarations: [
        ...components
    ],
    providers: [
        AuthenticationService,
        CredentialsService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        }
    ]
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
    // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        super(parentModule);
    }
}

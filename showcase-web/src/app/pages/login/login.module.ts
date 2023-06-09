import { NgModule } from "@angular/core";

import { SharedModule } from "../../shared/shared.module";
import { LoginRoutingModule } from "./login-routing.module";

@NgModule({
    imports: [
        SharedModule,
        LoginRoutingModule
    ],
    declarations: [
        ...LoginRoutingModule.components
    ]
})
export class LoginModule {
}

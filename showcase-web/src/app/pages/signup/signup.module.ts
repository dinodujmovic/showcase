import { NgModule } from "@angular/core";

import { SharedModule } from "../../shared/shared.module";
import { SignUpRoutingModule } from "./signup-routing.module";

@NgModule({
    imports: [
        SharedModule,
        SignUpRoutingModule
    ],
    declarations: [
        ...SignUpRoutingModule.components
    ]
})
export class SignUpModule {
}

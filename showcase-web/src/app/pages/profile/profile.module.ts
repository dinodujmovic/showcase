import { NgModule } from "@angular/core";

import { SharedModule } from "../../shared/shared.module";
import { ProfileComponent } from "./profile.component";
import { ProfileRoutingModule } from "./profile-routing.module";

@NgModule({
    imports: [
        SharedModule,
        ProfileRoutingModule
    ],
    declarations: [
        ...ProfileRoutingModule.components,
        ProfileComponent
    ]
})
export class ProfileModule { }

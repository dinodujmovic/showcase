import { NgModule } from "@angular/core";

import { SharedModule } from "../../shared/shared.module";
import { PostRoutingModule } from "./post-routing.module";

@NgModule({
    imports: [
        PostRoutingModule,
        SharedModule
    ],
    declarations: [
        ...PostRoutingModule.components
    ]
})
export class PostModule {
}

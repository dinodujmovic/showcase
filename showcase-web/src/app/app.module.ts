import { NgModule } from "@angular/core";
import { CoreModule } from "@core/core.module";
import { environment } from "@environment/environment";
import { EffectsModule } from "@ngrx/effects";
import { MetaReducer, StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { SharedModule } from "@shared/shared.module";
import { ToastrModule } from "ngx-toastr";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { reducers } from "./store";
import { AuthEffects } from "./store/effects/auth.effects";
import { PostEffects } from "./store/effects/post.effects";
import { UserEffects } from "./store/effects/user.effects";

export const metaReducers: MetaReducer<any>[] = !environment.production ? [] : [];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        AppRoutingModule, // Main routes for application
        CoreModule, // Singleton objects (services, shell that are loaded only once, etc.)
        SharedModule,
        StoreModule.forRoot(reducers, {
            metaReducers,
            runtimeChecks: {
                strictStateImmutability: true,
                strictActionImmutability: true
            }
        }), // Shared (multi-instance) objects
        EffectsModule.forRoot([
            AuthEffects,
            UserEffects,
            PostEffects
        ]),
        StoreDevtoolsModule.instrument({
            name: "Showcase App DevTools"
        }),
        ToastrModule.forRoot({
            timeOut: 2000,
            positionClass: "toast-bottom-right",
            preventDuplicates: true,
            enableHtml: true
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

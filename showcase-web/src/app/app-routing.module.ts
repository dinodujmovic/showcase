import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthenticationGuard } from "@core/guards/authentication.guard";
import { AuthorizationGuard } from "@core/guards/authorization.guard";
import { PreloadModulesStrategy } from "@core/strategies/preload-modules.strategy";

const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "/"
    },
    {
        path: "",
        data: { preload: true },
        loadChildren: () => import("./pages/post/post.module").then((m) => m.PostModule)
    },
    {
        path: "login",
        data: { preload: true },
        loadChildren: () => import("./pages/login/login.module").then((m) => m.LoginModule)
    },
    {
        path: "sign-up",
        data: { preload: false },
        loadChildren: () => import("./pages/signup/signup.module").then((m) => m.SignUpModule)
    },
    {
        path: "profile",
        data: { preload: false },
        canActivate: [AuthenticationGuard],
        loadChildren: () => import("./pages/profile/profile.module").then((m) => m.ProfileModule)
    },
    {
        path: "users",
        data: { preload: true },
        canActivate: [AuthorizationGuard],
        loadChildren: () => import("./pages/user/user.module").then((m) => m.UserModule)
    },
    {
        path: "**",
        pathMatch: "full",
        redirectTo: "/"
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadModulesStrategy })],
    exports: [RouterModule],
    providers: [PreloadModulesStrategy]
})
export class AppRoutingModule {
}

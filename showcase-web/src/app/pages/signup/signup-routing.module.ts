import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SignUpComponent } from "./signup.component";

const routes: Routes = [
    {
        path: "",
        component: SignUpComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SignUpRoutingModule {
    static components = [
        SignUpComponent
    ];
}

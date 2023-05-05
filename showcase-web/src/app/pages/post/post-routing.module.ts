import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PostComponent } from "./post.component";
import { PostCardComponent } from "./post-card/post-card.component";
import { PostUploadModalComponent } from "./post-upload-modal/post-upload-modal.component";

const routes: Routes = [
    { path: "", component: PostComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostRoutingModule {
    static components = [
        PostComponent,
        PostCardComponent,
        PostUploadModalComponent
    ];
}

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FileUploadModule } from "ng2-file-upload";
import { ImageCropperModule } from "ngx-image-cropper";

import { ProfileImageComponent } from "./components/profile-image/profile-image.component";

@NgModule({
    declarations: [
        ProfileImageComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ImageCropperModule,
        FileUploadModule,
        ProfileImageComponent,
        NgbModule
    ]
})
export class SharedModule {
}

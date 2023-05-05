import {
    Component, OnDestroy, OnInit, ViewChild
} from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { SubSink } from "subsink";

import { User } from "../../core/model/user.model";
import { HelperService } from "../../core/services/helper.service";
import { AppState, selectAuthState } from "../../store";
import * as AuthAction from "../../store/actions";
import { AuthState } from "../../store/reducers/auth.reducers";

@Component({
    selector: "sc-auth",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnDestroy {
    @ViewChild("imageInput") imageInput: any;
    @ViewChild("imageCropperModal") imageCropperModal: any;

    private modalRef!: NgbModalRef;
    private subs = new SubSink();
    private getState: Observable<any>;
    private supportedImageFormats = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/gif"
    ];

    public imageChangedEvent: any;
    public croppedImage: string;
    public user: User | null;
    public imageSizeTooLargeError!: boolean;

    constructor(
        private store: Store<AppState>,
        private modalService: NgbModal,
        private router: Router,
        private helperService: HelperService,
        private toastrService: ToastrService
    ) {
        this.getState = this.store.select(selectAuthState);

        this.subs.sink = this.getState
            .subscribe((state: AuthState) => {
                this.user = state.user;
                if (!state.isAuthenticated) {
                    this.router.navigate(["/"]);
                }
            });
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    fileChangeEvent(event: any): void {
        if (!event.target.files || !event.target.files.length) {
            return;
        }

        const file = event.target.files[0];
        if (!this.supportedImageFormats.includes(file.type)) {
            this.toastrService.error("File must be image (png, jpeg, jpg, gif) !");
            return;
        }

        this.imageSizeTooLargeError = false;
        this.imageChangedEvent = event;

        this.modalRef = this.modalService.open(this.imageCropperModal);

        this.modalRef.result.then(() => {
            this.imageInput.nativeElement.value = null;
        }, () => {
            this.imageInput.nativeElement.value = null;
        });
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = `${event.base64}`;
    }

    setNewProfileImage() {
        const file: File = this.helperService.dataURLtoFile(
            this.croppedImage,
            this.imageChangedEvent.target.files[0].name,
            this.imageChangedEvent.target.files[0].type
        );
        this.imageSizeTooLargeError = (file.size / 1024 / 1024 > 2);

        if (!this.imageSizeTooLargeError) {
            this.store.dispatch(new AuthAction.SetAvatar(file));
            this.modalRef.close();
            this.imageInput.nativeElement.value = null;
        } else {
            this.toastrService.error("Image is larger than 2 MB!");
        }
    }
}

import { Component, OnDestroy, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { createSelector, Store } from "@ngrx/store";
import { FileUploader } from "ng2-file-upload";
import { ToastrService } from "ngx-toastr";
import { skip } from "rxjs/operators";
import { SubSink } from "subsink";

import { selectPostState } from "../../../store";
import * as PostAction from "../../../store/actions";
import { PostState } from "../../../store/reducers/post.reducers";

@Component({
    selector: "sc-post-upload-modal",
    templateUrl: "./post-upload-modal.component.html",
    styleUrls: ["./post-upload-modal.component.scss"]
})
export class PostUploadModalComponent implements OnInit, OnDestroy {
    public uploader!: FileUploader;
    public hasBaseDropZoneOver!: boolean;
    public videoSizeTooLargeError!: boolean;
    public descriptionLengthError!: boolean;
    public selectedFile!: File | null;
    public fileURL!: any;
    public description!: string;
    public uploadInProgress!: boolean;

    private subs = new SubSink();
    private supportedVideoFormats = [
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-ms-wmv",
        "video/MP2T",
        "application/x-mpegURL",
        "video/x-flv"
    ];

    constructor(
        private store: Store<PostState>,
        public activeModal: NgbActiveModal,
        private toastrService: ToastrService,
        private sanitizer: DomSanitizer
    ) {
        this.subs.sink = this.store
            .select(createSelector(
                selectPostState,
                (state: PostState) => state.loading,
            ))
            .pipe(skip(1))
            .subscribe((loading: boolean) => {
                this.uploadInProgress = loading;
                if (!loading) {
                    this.activeModal.close();
                }
            });
    }

    ngOnInit(): void {
        this.uploader = new FileUploader({ disableMultipart: true });
        this.description = "";
        this.selectedFile = null;
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    fileOverBase(isFileOver: boolean): void {
        this.hasBaseDropZoneOver = isFileOver;
    }

    fileSelected(fileList: any) {
        if (!fileList || !fileList.length) {
            return;
        }

        const file = fileList[0];

        if (!this.supportedVideoFormats.includes(file.type)) {
            this.toastrService.error("File must be video !");
            return;
        }

        this.videoSizeTooLargeError = ((file.size / 1024 / 1024) > 10);

        if (this.videoSizeTooLargeError) {
            this.toastrService.error("Video is larger than 10 MB !");
            return;
        }

        this.fileURL = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
        this.selectedFile = file;
    }

    clearUpload() {
        this.selectedFile = null;
        this.description = "";
        this.videoSizeTooLargeError = false;
        this.descriptionLengthError = false;
    }

    upload() {
        this.descriptionLengthError = this.description.length < 5;
        if (this.descriptionLengthError || !this.selectedFile) {
            return;
        }

        this.store.dispatch(new PostAction.UploadPost({ file: this.selectedFile, description: this.description }));
    }
}

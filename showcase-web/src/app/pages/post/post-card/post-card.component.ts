import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from "@angular/core";
import { createSelector, Store } from "@ngrx/store";
import { skip } from "rxjs/operators";
import { SubSink } from "subsink";

import { Post } from "../../../core/model/post.model";
import { CredentialsService } from "../../../core/services/credentials.service";
import { HelperService } from "../../../core/services/helper.service";
import { selectAuthState, selectPostState } from "../../../store";
import * as PostAction from "../../../store/actions";
import { AuthState } from "../../../store/reducers/auth.reducers";
import { PostState } from "../../../store/reducers/post.reducers";
import { PostCoreService } from "../post-core.service";

@Component({
    selector: "sc-post-card",
    templateUrl: "./post-card.component.html",
    styleUrls: ["./post-card.component.scss"]
})
export class PostCardComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild("video") video!: ElementRef;
    @Input() post!: Post;
    @Input() currentlyPlayingVideo!: number;
    @Output() videoPlayed = new EventEmitter();

    private subs = new SubSink();

    public isPlaying!: boolean;
    public mediaPath!: string;
    public showDelete!: boolean;
    public postDeleteInProgress!: boolean;

    constructor(
        private store: Store<PostState>,
        private postCoreService: PostCoreService,
        private credentialsService: CredentialsService,
        private helperService: HelperService
    ) {
        this.subs.sink = this.postCoreService.currentlyPlayingVideoObservable
            .pipe(skip(1))
            .subscribe((value) => {
                if (value !== this.post.id
          && this.video
          && this.isPlaying) {
                    this.isPlaying = false;
                    this.video.nativeElement.pause();
                }
            });

        this.subs.sink = this.store
            .select(createSelector(
                selectAuthState,
                (state: AuthState) => state.isAuthenticated,
            ))
            .pipe(skip(1))
            .subscribe((isAuthenticated: boolean) => {
                if (!isAuthenticated) {
                    this.showDelete = false;
                }
            });

        this.subs.sink = this.store
            .select(createSelector(
                selectPostState,
                (state: PostState) => state.loading,
            ))
            .pipe(skip(1))
            .subscribe((loading: boolean) => {
                this.postDeleteInProgress = loading;
            });
    }

    ngOnInit(): void {
        this.isPlaying = false;
        this.mediaPath = this.helperService.getMediaPath();
        if (this.credentialsService.isAuthenticated()) {
            const currentUser = this.credentialsService.credentials?.user;
            this.showDelete = currentUser?.id === this.post.user.id || this.credentialsService.isAdmin();
        }
    }

    ngAfterViewInit(): void {
        this.video.nativeElement.addEventListener("ended", () => {
            this.isPlaying = false;
            this.video.nativeElement.load();
        }, false);
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    playVideo(postId: number) {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.video.nativeElement.pause();
            this.postCoreService.setCurrentlyPlayingVideo(null);
        } else {
            this.isPlaying = true;
            this.video.nativeElement.play();
            this.postCoreService.setCurrentlyPlayingVideo(postId);
        }
    }

    deletePost(postId: number) {
        if (this.postDeleteInProgress) {
            return;
        }

        // eslint-disable-next-line no-alert
        const result = window.confirm("Are you sure?");
        if (result) {
            this.store.dispatch(new PostAction.DeletePost(postId));
        }
    }
}

import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ToastrService } from "ngx-toastr";
import { Observable, of } from "rxjs";
import {
    catchError, map, switchMap, tap
} from "rxjs/operators";

import { ScError } from "../../core/model/error.model";
import { Post, PostResponse } from "../../core/model/post.model";
import { PostService } from "../../core/services/post.service";
import * as PostAction from "../actions";
import { PostActionTypes } from "../actions";

@Injectable()
export class PostEffects {
    constructor(
        private actions: Actions,
        private postService: PostService,
        private toastrService: ToastrService,
        private router: Router
    ) {
    }

    getPosts: Observable<any> = createEffect(() => this.actions
        .pipe(
            ofType(PostActionTypes.GET_POSTS),
            map((action: PostAction.GetPosts) => action.payload),
            switchMap((action) => {
                const limit = (action && action.limit) ? action.limit : undefined;
                const page = (action && action.page) ? action.page : undefined;

                return this.postService.getPosts(limit, page)
                    .pipe(
                        map((response: PostResponse) => new PostAction.GetPostsSuccess(response)),
                        catchError((error: ScError) => of(new PostAction.GetPostsFailure(error)))
                    );
            })
        ));

    getPostsSuccess: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(PostActionTypes.GET_POSTS_SUCCESS),
        map((action: PostAction.GetPostsSuccess) => action.payload),
        tap((response: PostResponse) => {
        })
    ), { dispatch: false });

    getPostsFailure: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(PostActionTypes.GET_POSTS_FAILURE),
        map((action: PostAction.GetPostsFailure) => action.payload),
        tap((error: ScError) => {
            this.toastrService.error(`${error.message}`, `${error.statusCode} (${error.status})`);
        })
    ), { dispatch: false });

    uploadPost: Observable<any> = createEffect(() => this.actions
        .pipe(
            ofType(PostActionTypes.UPLOAD_POST),
            map((action: PostAction.UploadPost) => action.payload),
            switchMap((payload) => this.postService.uploadPost(payload!.file, payload!.description)
                .pipe(
                    map((post: Post) => new PostAction.UploadPostSuccess(post)),
                    catchError((error: ScError) => of(new PostAction.UploadPostFailure(error)))
                ))
        ));

    uploadPostSuccess: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(PostActionTypes.UPLOAD_POST_SUCCESS),
        map((action: PostAction.UploadPostSuccess) => action.payload),
        tap(() => {
            this.router.navigateByUrl("/");
            this.toastrService.success("Post uploaded");
        })
    ), { dispatch: false });

    uploadPostFailure: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(PostActionTypes.UPLOAD_POST_FAILURE),
        map((action: PostAction.UploadPostFailure) => action.payload),
        tap((error: ScError) => {
            this.toastrService.error(error.message, `${error.statusCode} (${error.status})`);
        })
    ), { dispatch: false });

    deleteUser: Observable<any> = createEffect(() => this.actions
        .pipe(
            ofType(PostActionTypes.DELETE_POST),
            map((action: PostAction.DeletePost) => action.payload),
            switchMap((payload: number) => this.postService.deletePost(payload)
                .pipe(
                    map(() => new PostAction.DeletePostSuccess(payload)),
                    catchError((error: ScError) => of(new PostAction.DeletePostFailure(error)))
                ))
        ));

    deleteUserSuccess: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(PostActionTypes.DELETE_POST_SUCCESS),
        map((action: PostAction.DeleteUserSuccess) => action.payload),
        tap(() => {
            this.toastrService.success("Post deleted.");
        })
    ), { dispatch: false });

    deleteUserFailure: Observable<any> = createEffect(() => this.actions.pipe(
        ofType(PostActionTypes.DELETE_POST_FAILURE),
        map((action: PostAction.DeletePostFailure) => action.payload),
        tap((error: ScError) => {
            this.toastrService.error(`${error.message}`, `${error.statusCode} (${error.status})`);
        })
    ), { dispatch: false });
}

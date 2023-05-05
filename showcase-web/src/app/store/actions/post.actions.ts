import { Action } from "@ngrx/store";

import { ScError } from "../../core/model/error.model";
import { Post, PostResponse } from "../../core/model/post.model";

export enum PostActionTypes {
    GET_POSTS = "[Post] Get Posts",
    GET_POSTS_SUCCESS = "[Post] Get Posts Success",
    GET_POSTS_FAILURE = "[Post] Get Posts Failure",
    CLEAR_POSTS = "[Post] Clear Posts",
    UPLOAD_POST = "[Post] Upload Post",
    UPLOAD_POST_SUCCESS = "[Post] Upload Post Success",
    UPLOAD_POST_FAILURE = "[Post] Upload Post Failure",
    DELETE_POST = "[Post] Delete Post",
    DELETE_POST_SUCCESS = "[Post] Delete Post Success",
    DELETE_POST_FAILURE = "[Post] Delete Post Failure",
}

export class GetPosts implements Action {
    readonly type = PostActionTypes.GET_POSTS;

    constructor(public readonly payload?: { page?: number, limit?: number }) {
    }
}

export class GetPostsSuccess implements Action {
    readonly type = PostActionTypes.GET_POSTS_SUCCESS;

    constructor(public readonly payload: PostResponse) {
    }
}

export class GetPostsFailure implements Action {
    readonly type = PostActionTypes.GET_POSTS_FAILURE;

    constructor(public readonly payload: ScError) {
    }
}

export class UploadPost implements Action {
    readonly type = PostActionTypes.UPLOAD_POST;

    constructor(public readonly payload?: { file: File, description: string }) {
    }
}

export class UploadPostSuccess implements Action {
    readonly type = PostActionTypes.UPLOAD_POST_SUCCESS;

    constructor(public readonly payload: Post) {
    }
}

export class UploadPostFailure implements Action {
    readonly type = PostActionTypes.UPLOAD_POST_FAILURE;

    constructor(public readonly payload: ScError) {
    }
}

export class DeletePost implements Action {
    readonly type = PostActionTypes.DELETE_POST;

    constructor(public readonly payload: number) {
    }
}

export class DeletePostSuccess implements Action {
    readonly type = PostActionTypes.DELETE_POST_SUCCESS;

    constructor(public readonly payload: number) {
    }
}

export class DeletePostFailure implements Action {
    readonly type = PostActionTypes.DELETE_POST_FAILURE;

    constructor(public readonly payload: ScError) {
    }
}

export class ClearPosts implements Action {
    readonly type = PostActionTypes.CLEAR_POSTS;
}

export type AllPostActions =
  | GetPosts
  | GetPostsSuccess
  | GetPostsFailure
  | ClearPosts
  | UploadPost
  | UploadPostSuccess
  | UploadPostFailure
  | DeletePost
  | DeletePostSuccess
  | DeletePostFailure;

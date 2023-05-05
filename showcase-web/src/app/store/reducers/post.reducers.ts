import { ScError } from "../../core/model/error.model";
import { Post } from "../../core/model/post.model";
import * as PostActions from "../actions";
import { PostActionTypes } from "../actions";

export interface PostState {
    posts: Post[];

    params: { limit?: number, page?: number };

    count: number;

    error: ScError | null;

    loading: boolean;
}

export const initialState: PostState = {
    posts: [],

    params: {},

    count: 0,

    error: null,

    loading: false
};

export function reducer(
    state = initialState,
    action: PostActions.AllPostActions
): PostState {
    switch (action.type) {
        case PostActionTypes.GET_POSTS: {
            const params: any = {};

            if (action && action.payload && action.payload.limit) {
                params.limit = action.payload.limit;
            }

            if (action && action.payload && action.payload.page) {
                params.page = action.payload.page;
            }

            const data = {
                ...state,
                loading: true,
                params
            };

            return data;
        }

        case PostActionTypes.GET_POSTS_SUCCESS: {
            return {
                ...state,
                posts: [...state.posts, ...action.payload.data],
                count: action.payload.count,
                loading: false,
                error: null
            };
        }

        case PostActionTypes.GET_POSTS_FAILURE: {
            return {
                ...state,
                posts: [],
                params: {},
                count: 0,
                error: action.payload,
                loading: false
            };
        }

        case PostActionTypes.CLEAR_POSTS: {
            return initialState;
        }

        case PostActionTypes.UPLOAD_POST: {
            return {
                ...state,
                loading: true
            };
        }

        case PostActionTypes.UPLOAD_POST_SUCCESS: {
            return {
                ...state,
                posts: [action.payload, ...state.posts],
                loading: false
            };
        }

        case PostActionTypes.UPLOAD_POST_FAILURE: {
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        }

        case PostActionTypes.DELETE_POST: {
            return {
                ...state,
                loading: true
            };
        }

        case PostActionTypes.DELETE_POST_SUCCESS: {
            return {
                ...state,
                posts: state.posts.filter((post) => post.id !== action.payload),
                count: state.count - 1,
                loading: false
            };
        }

        case PostActionTypes.DELETE_POST_FAILURE: {
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        }

        default:
    }

    return state;
}

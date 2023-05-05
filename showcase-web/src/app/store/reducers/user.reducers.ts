import { ScError } from "../../core/model/error.model";
import { User } from "../../core/model/user.model";
import { UserActionTypes } from "../actions";
import * as UserActions from "../actions";

export interface UserState {
    users: User[];

    error: ScError | null;

    loading: boolean;
}

export const initialState: UserState = {
    users: [],
    error: null,
    loading: false
};

export function reducer(
    state = initialState,
    action: UserActions.AllUserActions
): UserState {
    switch (action.type) {
        case UserActionTypes.GET_USERS: {
            return {
                ...state,
                loading: true
            };
        }

        case UserActionTypes.GET_USERS_SUCCESS: {
            return {
                ...state,
                users: action.payload,
                loading: false,
                error: null
            };
        }

        case UserActionTypes.GET_USERS_FAILURE: {
            return {
                ...state,
                users: [],
                error: action.payload,
                loading: false
            };
        }

        case UserActionTypes.DELETE_USER: {
            return {
                ...state,
                loading: true
            };
        }

        case UserActionTypes.DELETE_USER_SUCCESS: {
            return {
                ...state,
                users: state.users.filter((user) => user.id !== action.payload),
                loading: false
            };
        }

        case UserActionTypes.DELETE_USER_FAILURE: {
            return {
                ...state,
                loading: false
            };
        }

        default:
    }

    return state;
}

import { ScError } from "../../core/model/error.model";
import { User } from "../../core/model/user.model";
import { AuthActionTypes } from "../actions";
import * as AuthActions from "../actions";

export interface AuthState {
    // is a user authenticated?
    isAuthenticated: boolean;
    // if authenticated, there should be a user object
    user: User | null;

    token: string | null;

    // error message
    error: ScError | null;

    loading: boolean;
}

export const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: "",
    loading: false,
    error: null
};

export function reducer(
    state = initialState,
    action: AuthActions.AllAuthActions
): AuthState {
    switch (action.type) {
        case AuthActionTypes.LOGIN: {
            return {
                ...state,
                loading: true
            };
        }

        case AuthActionTypes.LOGIN_SUCCESS: {
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null
            };
        }

        case AuthActionTypes.LOGIN_FAILURE: {
            return {
                ...state,
                isAuthenticated: false,
                error: action.payload,
                loading: false
            };
        }

        case AuthActionTypes.LOGOUT: {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                loading: false,
                token: "",
                error: null
            };
        }

        case AuthActionTypes.SIGNUP: {
            return {
                ...state,
                loading: true
            };
        }

        case AuthActionTypes.SIGNUP_SUCCESS: {
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null
            };
        }

        case AuthActionTypes.SIGNUP_FAILURE: {
            return {
                ...state,
                isAuthenticated: false,
                error: action.payload,
                loading: false
            };
        }

        case AuthActionTypes.GET_ME_SUCCESS: {
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null
            };
        }

        case AuthActionTypes.GET_ME_FAILURE: {
            return {
                ...state,
                isAuthenticated: false,
                error: action.payload,
                loading: false
            };
        }

        case AuthActionTypes.SET_AVATAR: {
            return {
                ...state,
                loading: true,
            };
        }

        case AuthActionTypes.SET_AVATAR_SUCCESS: {
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null
            };
        }

        case AuthActionTypes.SET_AVATAR_FAILURE: {
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        }

        default:
    }

    return state;
}

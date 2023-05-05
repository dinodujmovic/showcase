import { User } from "./user.model";

export interface LogInContext {
    username: string;
    password: string;
}

export interface SignUpContext {
    username: string;
    email: string;
    password: string;
    matchingPassword: string;
}

export interface Credentials {
    // Customize received credentials here
    user: User | null;
    token: string;
}

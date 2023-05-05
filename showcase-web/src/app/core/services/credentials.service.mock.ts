import { Credentials } from "../model/auth.model";

export class MockCredentialsService {
    credentials: Credentials | null = {
        user: null,
        token: "123"
    };

    isAuthenticated(): boolean {
        return !!this.credentials;
    }

    setCredentials(credentials?: Credentials) {
        this.credentials = credentials || null;
    }
}

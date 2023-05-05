import { Observable, of } from "rxjs";

import { Credentials, LogInContext } from "../model/auth.model";

export class MockAuthenticationService {
    credentials: Credentials | null = {
        user: {
            id: "1234",
            username: "Dino",
            email: "a@a",
            role: "ADMIN",
            profileImg: ""
        },
        token: "123"
    };

    login(context: LogInContext): Observable<Credentials> {
        return of({
            user: {
                id: "1234",
                username: "Dino",
                email: "a@a",
                role: "ADMIN",
                profileImg: ""
            },
            token: "123456"
        });
    }

    logout(): Observable<boolean> {
        this.credentials = null;
        return of(true);
    }
}

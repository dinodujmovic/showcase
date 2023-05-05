import { TestBed } from "@angular/core/testing";

import { Credentials } from "../model/auth.model";
import { User } from "../model/user.model";
import { CredentialsService } from "./credentials.service";

const credentialsKey = "credentials";

const user: User = {
    id: "1",
    username: "dino",
    email: "dino@gmail.com",
    role: "ADMIN",
    profileImg: ""
};

describe("CredentialsService", () => {
    let credentialsService: CredentialsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CredentialsService]
        });

        credentialsService = TestBed.get(CredentialsService);
    });

    afterEach(() => {
    // Cleanup
        localStorage.removeItem(credentialsKey);
        sessionStorage.removeItem(credentialsKey);
    });

    describe("setCredentials", () => {
        it("should authenticate user if credentials are set", () => {
            // Act
            credentialsService.setCredentials({
                user, token: "123"
            });

            // Assert
            expect(credentialsService.isAuthenticated()).toBe(true);
            expect((credentialsService.credentials as Credentials).user).toBe(user);
        });

        it("should clean authentication", () => {
            // Act
            credentialsService.setCredentials();

            // Assert
            expect(credentialsService.isAuthenticated()).toBe(false);
        });

        it("should persist credentials for the session", () => {
            // Act
            credentialsService.setCredentials({ user, token: "123" });

            // Assert
            expect(sessionStorage.getItem(credentialsKey)).not.toBeNull();
            expect(localStorage.getItem(credentialsKey)).toBeNull();
        });

        it("should persist credentials across sessions", () => {
            // Act
            credentialsService.setCredentials({ user, token: "123" }, true);

            // Assert
            expect(localStorage.getItem(credentialsKey)).not.toBeNull();
            expect(sessionStorage.getItem(credentialsKey)).toBeNull();
        });

        it("should clear user authentication", () => {
            // Act
            credentialsService.setCredentials();

            // Assert
            expect(credentialsService.isAuthenticated()).toBe(false);
            expect(credentialsService.credentials).toBeNull();
            expect(sessionStorage.getItem(credentialsKey)).toBeNull();
            expect(localStorage.getItem(credentialsKey)).toBeNull();
        });
    });
});

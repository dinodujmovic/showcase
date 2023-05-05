import { AbstractControl, ValidatorFn } from "@angular/forms";

export class TextValidator {
    static passwordMatcher(): ValidatorFn {
        return (c: AbstractControl) => {
            const passwordControl = c.get("password");
            const confirmControl = c.get("matchingPassword");

            if (passwordControl?.pristine || confirmControl?.pristine) {
                return null;
            }

            if (passwordControl?.value === confirmControl?.value) {
                return null;
            }
            return { match: true };
        };
    }
}

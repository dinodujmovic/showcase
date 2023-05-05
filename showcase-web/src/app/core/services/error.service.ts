import { Injectable } from "@angular/core";

import { ApiError, ApiErrorMessage, ScError } from "../model/error.model";

@Injectable({
    providedIn: "root"
})
export class ErrorService {
    handleError(error: ApiError): ScError {
        // eslint-disable-next-line no-console
        console.log(error);

        const scError: ScError = {
            statusCode: error.statusCode,
            status: error.error,
            message: ""
        };

        if (error.message && error.message.length) {
            if (Array.isArray(error.message)) {
                error.message.forEach((message: ApiErrorMessage) => {
                    Object.keys(message.constraints).forEach((key) => {
                        scError.message += `<li>${message.constraints[key]}</li>`;
                    });
                });
            } else {
                scError.message = error.message;
            }
        }

        return scError;
    }
}

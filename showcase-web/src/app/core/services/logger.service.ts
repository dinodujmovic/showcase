import { Injectable } from "@angular/core";

import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class LoggerService {
    log(msg: string) {
        if (!environment.production) {
            // eslint-disable-next-line no-console
            console.log(msg);
        }
    }

    logError(msg: string) {
        if (!environment.production) {
            // eslint-disable-next-line no-console
            console.error(msg);
        }
    }
}

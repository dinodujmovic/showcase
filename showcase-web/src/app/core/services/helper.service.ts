import { Injectable } from "@angular/core";
import { environment } from "@environment/environment";

@Injectable({
    providedIn: "root"
})
export class HelperService {
    getMediaPath() {
        return `${environment.serverUrl}/media`;
    }

    dataURLtoFile(base64: string, filename: string, type: any) {
        const arr = base64.split(",");
        // const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        // eslint-disable-next-line no-plusplus
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type });
    }
}

import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class PostCoreService {
    private _currentlyPlayingVideo: BehaviorSubject<any> = new BehaviorSubject(null);

    get currentlyPlayingVideoObservable() {
        return this._currentlyPlayingVideo.asObservable();
    }

    get currentlyPlayingVideo() {
        return this._currentlyPlayingVideo.value;
    }

    setCurrentlyPlayingVideo(value: any) {
        this._currentlyPlayingVideo.next(value);
    }
}

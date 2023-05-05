import { Component, Input, OnInit } from "@angular/core";

import { HelperService } from "../../../core/services/helper.service";

@Component({
    selector: "sc-profile-image",
    templateUrl: "./profile-image.component.html",
})
export class ProfileImageComponent implements OnInit {
    @Input() classes: string;
    @Input() profileImg: string | undefined;
    mediaPath!: string;

    constructor(private helperService: HelperService) {
    }

    ngOnInit(): void {
        this.mediaPath = this.helperService.getMediaPath();
    }
}

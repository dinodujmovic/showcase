import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { StoreModule } from "@ngrx/store";

import { metaReducers } from "../../app.module";
import { reducers } from "../../store";
import { PostComponent } from "./post.component";

describe("PostComponent", () => {
    let component: PostComponent;
    let fixture: ComponentFixture<PostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                StoreModule.forRoot(reducers, {
                    metaReducers,
                    runtimeChecks: {
                        strictStateImmutability: true,
                        strictActionImmutability: true
                    }
                }),
            ],
            declarations: [PostComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});

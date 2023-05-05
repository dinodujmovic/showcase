import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { skip } from "rxjs/operators";
import { SubSink } from "subsink";

import { Post } from "../../core/model/post.model";
import { selectPostState } from "../../store";
import * as PostAction from "../../store/actions";
import { PostState } from "../../store/reducers/post.reducers";

@Component({
    selector: "sc-post",
    templateUrl: "./post.component.html",
    styleUrls: ["./post.component.scss"]
})
export class PostComponent implements OnInit, OnDestroy {
    private subs = new SubSink();
    private page: number;
    private limit = 10;

    public isLoading = false;
    public showLoadMore = false;
    public posts: Post[] = [];

    constructor(private store: Store<PostState>) {
        this.subs.sink = this.store.select(selectPostState)
            .pipe(skip(1))
            .subscribe((state: PostState) => {
                this.posts = state.posts;
                this.isLoading = state.loading;
                this.showLoadMore = (state.posts.length !== 0 && state.posts.length < state.count);
                this.page = state.params.page || 0;
            });

    // Example: How to Subscribe to one state property
    // this.subs.sink = this.store
    //   .select(createSelector(
    //     selectPostState,
    //     (state: PostState) => state.posts,
    //   ))
    //   .pipe(skip(1))
    //   .subscribe((posts: Post[]) => {
    //     this.posts.push(...posts);
    //   });
    }

    ngOnInit() {
        this.store.dispatch(new PostAction.ClearPosts());
        this.store.dispatch(new PostAction.GetPosts({ limit: this.limit, page: 1 }));
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    loadMore() {
        if (this.isLoading) {
            return;
        }

        this.page += this.page;
        this.store.dispatch(new PostAction.GetPosts({ limit: this.limit, page: this.page }));
    }
}

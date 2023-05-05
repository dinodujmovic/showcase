import { Action } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { catchError, mergeMap } from "rxjs/operators";

export class DataServiceError<T> {
    constructor(public error: any, public requestData: T) {
    }
}

export abstract class DataAction<T> implements Action {
    readonly type!: string;

    constructor(public readonly payload: T) {
    }
}

export abstract class DataErrorAction<T> implements Action {
    readonly type!: string;

    constructor(public readonly payload: DataServiceError<T>) {
    }
}

// Function of additional success actions
// that returns a function that returns
// an observable of ngrx action(s) from DataService method observable
export const toAction = (...actions: Action[]) => <T>(
    source: Observable<T>,
    SuccessAction: new (data: T) => Action,
    ErrorAction: new (err: DataServiceError<T>) => Action
) => source.pipe(
    mergeMap((data: T) => [new SuccessAction(data), ...actions]),
    catchError((err: DataServiceError<T>) => of(new ErrorAction(err)))
);

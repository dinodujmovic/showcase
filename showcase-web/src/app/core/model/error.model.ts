export interface ApiErrorMessage {
    target: any;
    value: string;
    property: string;
    children: any[];
    constraints: any;
}

export interface ApiError {
    statusCode: number;
    error: string;
    message?: ApiErrorMessage[];
}

export interface ScError {
    statusCode: number;
    status: string;
    message?: string;
}

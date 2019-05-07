export interface Ok<T> {
    result: T;
}

export interface Err {
    message: string;
}

export type Result<T> = Ok<T> | Err;

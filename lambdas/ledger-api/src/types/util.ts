abstract class BaseResult {
    succeeded = false;
    public isOk <T>(): this is Ok<T>{
        return this.succeeded;
    };
}

export class Ok<T> extends BaseResult{
    result: T;
    succeeded = true;
    constructor(t: T){
        super();
        this.result = t;
    }
}

export class Err extends BaseResult{
    message: string;
    succeeded = false;

    constructor(message: string){
        super();
        this.message = message;
    }
}

export class HttpError extends Err {
    status: string;
    constructor(message: string, status: string){
        super(message);
        this.status = status;
    }
}

const httpError = (defaultMessage: string, status: string, message?: string) => {
    return new HttpError(message || defaultMessage, status);
};

export const Errors = {
    notFound: (message?: string) => httpError('not found', '404', message),
    conflict: (message?: string) => httpError('conflict', '409', message)
};


export type Result<T> = Ok<T> | Err;

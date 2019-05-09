abstract class BaseResult {
    public status: string = '';
    public isOk <T>(): this is Ok<T> {
        return this.status === 'ok';
    }
}

export class Ok<T> extends BaseResult {
    public result: T;
    public status: string = 'ok';
    constructor(t: T) {
        super();
        this.result = t;
    }
}

export class Err extends BaseResult {
    public message: string;
    public status: string = 'err';

    constructor(message: string) {
        super();
        this.message = message;
    }
}

export type Result<T> = Ok<T> | Err;

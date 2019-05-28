abstract class BaseResult {
    status: string = '';
    public isOk <T>(): this is Ok<T>{
        return this.status === 'ok';
    };
}

export class Ok<T> extends BaseResult{
    result: T;
    status: string = 'ok';
    constructor(t: T){
        super();
        this.result = t;
    }
}

export class Err extends BaseResult{
    message: string;
    status: string = 'err';

    constructor(message: string){
        super();
        this.message = message;
    }
}

export type Result<T> = Ok<T> | Err;

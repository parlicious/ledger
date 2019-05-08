export class Ok<T> {
    result: T;
    status: string = 'ok';
    constructor(t: T){
        this.result = t;
    }
}

export class Err {
    message: string;
    status: string = 'err';

    constructor(message: string){
        this.message = message;
    }
}

export type Result<T> = Ok<T> | Err;

import {Request} from 'serverlith/dist/http';

export interface CreateUserRequest extends Request {
    body: {
        token: string,
        email: string,
        phoneNumber: string,
    };
}

import {Request} from '../../http';

export interface CreateUserRequest extends Request {
    body: {
        token: string,
        email: string,
        phoneNumber: string,
    };
}

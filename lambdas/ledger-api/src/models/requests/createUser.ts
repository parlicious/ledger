import {Request} from '../../microlith/http';

export interface CreateUserRequest extends Request {
    body: {
        token: string,
        email: string,
        phoneNumber: string,
    };
}

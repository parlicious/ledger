import {ServerlithRequest} from 'serverlith/http';

export interface CreateUserRequest extends ServerlithRequest {
    body: {
        token: string,
        email: string,
        phoneNumber: string,
    };
}

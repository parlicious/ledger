import {ServerlithRequest} from 'serverlith/http';

export interface AuthRequest extends ServerlithRequest {
    body: {
        token: string;
    };
}

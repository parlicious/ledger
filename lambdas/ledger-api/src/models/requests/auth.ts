import {ServerlithRequest} from '../../microlith/http';

export interface AuthRequest extends ServerlithRequest {
    body: {
        token: string;
    };
}

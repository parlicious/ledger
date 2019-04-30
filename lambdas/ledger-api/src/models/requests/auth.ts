import {Request} from '../../microlith/http';

export interface AuthRequest extends Request {
    body: {
        token: string;
    };
}

import {Request} from '../../http';

export interface AuthRequest extends Request {
    body: {
        token: string;
    };
}

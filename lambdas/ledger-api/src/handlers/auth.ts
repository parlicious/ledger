import { fail, Response, success } from '../http';
import { AuthRequest } from '../models/requests/auth';
import { GET, nest, POST } from '../router';
import { authenticate } from '../services/users';

const authHandler = async (request: AuthRequest): Promise<Response> => {
    const authResult = await authenticate(request.body.token);
    if (authResult.status === 'success') {
       return success(authResult.user || {});
    } else {
        return fail(authResult.message || '');
    }
};

export default POST('/authenticate', authHandler);

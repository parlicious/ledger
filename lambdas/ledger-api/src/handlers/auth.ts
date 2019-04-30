import { fail, Response, success } from '../microlith/http';
import { POST } from '../microlith/routing-dsl';
import { AuthRequest } from '../models/requests/auth';
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

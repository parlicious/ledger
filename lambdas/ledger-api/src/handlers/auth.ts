import {fail, Request, Response, success} from '../microlith/http';
import {GET, handle, POST} from '../microlith/router/functional';
import {AuthRequest} from '../models/requests/auth';
import {authenticate} from '../services/users';

const authHandler = async (request: AuthRequest): Promise<Response> => {
    const authResult = await authenticate(request.body.token);
    if (authResult.status === 'success') {
        return success(authResult.user || {});
    } else {
        return fail(authResult.message || '');
    }
};

export default POST('/authenticate', authHandler);


const handler = handle('/users',
    GET('/:id', async (request: Request): Promise<Response> => {
        return fail('not implemented');
    }),
    POST('', async (request: Request): Promise<Response> => {
        return fail('not implemented');
    })
);
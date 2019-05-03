import {AuthRequest} from '../models/requests/auth';
import {authenticate} from '../services/users';
import {fail, success, Request, Response} from "serverlith/dist/http";
import {GET, POST, handle} from "serverlith/dist/router/functional";

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
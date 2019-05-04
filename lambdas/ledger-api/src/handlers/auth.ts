import {AuthRequest} from '../models/requests/auth';
import {authenticate} from '../services/users';
import {fail, success, ServerlithResponse, ServerlithRequest} from "serverlith/http";
import {GET, handle, POST} from "serverlith/functional";

const authHandler = async (request: AuthRequest): Promise<ServerlithResponse> => {
    const authResult = await authenticate(request.body.token);
    if (authResult.status === 'success') {
        return success(authResult.user || {});
    } else {
        return fail(authResult.message || '');
    }
};

export default POST('/authenticate', authHandler);
const handler = handle('/users',
    GET('/:id', async (request: ServerlithRequest): Promise<ServerlithResponse> => {
        return fail('not implemented');
    }),
    POST('', async (request: ServerlithRequest): Promise<ServerlithResponse> => {
        return fail('not implemented');
    })
);
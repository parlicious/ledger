import { fail, Request, Response, success } from '../microlith/http';
import { and, DELETE, GET, nest, POST, PUT } from '../microlith/routing-dsl';
import { CreateUserRequest } from '../models/requests/createUser';
import * as userService from '../services/users';

const createUser = async (request: CreateUserRequest): Promise<Response>  => {
    return fail('not implemented');
};

const updateUser = async (request: CreateUserRequest): Promise<Response>  => {
    return fail('not implemented');
};

const deleteUser = async (request: CreateUserRequest): Promise<Response>  => {
    return fail('not implemented');
};

const getUser = async (request: Request): Promise<Response> => {
    const email = request.pathParams.email;
    if (!!email) {
        const getUserResult = await userService.getUser(email);
        if (getUserResult.status === 'success') {
            return success(getUserResult.user || {});
        }

        return fail(`User with email: ${email} not found`, '404');
    }
    return fail('path parameter "email" is required');
};

const searchUsers = async (request: Request): Promise<Response> => {
    return fail('not implemented');
};

export default and(
    nest('/user/:email',
        GET('', getUser),
        PUT('', updateUser),
        DELETE('', deleteUser)),
    nest('/users',
        GET('', searchUsers),
        POST('', createUser)));

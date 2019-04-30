import { fail, Request, Response } from '../http';
import { CreateUserRequest } from '../models/requests/createUser';
import { and, DELETE, GET, nest, POST, PUT } from '../router';

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
    console.log(`EMAIL: ${request.pathParams['email']}`);
    return fail('not implemented');
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

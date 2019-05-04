
import { fail, Request, Response, success } from 'serverlith/http';
import { CreateUserRequest } from '../models/requests/createUser';
import * as userService from '../services/users';
import {DELETE, GET, Handler, POST, PUT} from "serverlith/decorators";

@Handler({path: '/users'})
export class UserHandler {

    @GET('/:email')
    public async getUser(request: Request): Promise<Response> {
        const email = request.pathParams.email;
        if (!!email) {
            const getUserResult = await userService.getUser(email);
            if (getUserResult.status === 'success') {
                return success(getUserResult.user || {});
            }

            return fail(`User with email: ${email} not found`, '404');
        }
        return fail('path parameter "email" is required');
    }

    @POST('/:email')
    public async createUser(request: CreateUserRequest): Promise<Response> {
        return fail(`user was: ${request.pathParams['email']}`);
    }

    @PUT('/:email')
    public async updateUser(request: CreateUserRequest): Promise<Response> {
        return fail('not implemented');
    }

    @DELETE('/:email')
    public async deleteUser(request: CreateUserRequest): Promise<Response> {
        return fail('not implemented');
    }

    @GET('')
    public async searchUsers(request: Request): Promise<Response> {
        return fail('not implemented');
    }
}

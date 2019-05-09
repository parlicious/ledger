import { inject, injectable } from 'inversify';
import { DELETE, GET, Handler, POST, PUT } from 'serverlith/decorators';
import { fail, ServerlithRequest, ServerlithResponse, success } from 'serverlith/http';

import { UserService } from '../services/UserService';
import { CreateUserRequest } from '../types/requests/createUser';

@Handler({ path: '/users' })
export class UserHandler {

    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    @GET({ path: '/:email' })
    public async getUser(request: ServerlithRequest): Promise<ServerlithResponse> {
        const email = request.pathParams.email;
        if (!!email) {
            const getUserResult = await this.userService.getUser(email);
            if (getUserResult.isOk()) {
                return success(getUserResult.result);
            }

            return fail(`User with email: ${email} not found`, '404');
        }
        return fail('path parameter "email" is required');
    }

    @POST({ path: '/:email' })
    public async createUser(request: CreateUserRequest): Promise<ServerlithResponse> {
        return fail(`user was: ${request.pathParams.email}`);
    }

    @PUT({ path: '/:email' })
    public async updateUser(request: CreateUserRequest): Promise<ServerlithResponse> {
        return fail('not implemented');
    }

    @DELETE({ path: '/:email' })
    public async deleteUser(request: CreateUserRequest): Promise<ServerlithResponse> {
        return fail('not implemented');
    }

    @GET({ path: '' })
    public async searchUsers(request: ServerlithRequest): Promise<ServerlithResponse> {
        return fail('not implemented');
    }
}

import { DELETE, GET, Handler, POST, PUT } from '../microlith/decorators';
import { fail, Request, Response, success } from '../microlith/http';
import { CreateUserRequest } from '../models/requests/createUser';
import * as userService from '../services/users';

@Handler({path: '/users'})
export class UserHandler {

    @POST('/:email')
    public async createUser(request: CreateUserRequest): Promise<Response> {
        return fail('not implemented');
    }

    @PUT('/:email')
    public async updateUser(request: CreateUserRequest): Promise<Response> {
        return fail('not implemented');
    }

    @DELETE('/:email')
    public async deleteUser(request: CreateUserRequest): Promise<Response> {
        return fail('not implemented');
    }

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

    @GET('')
    public async searchUsers(request: Request): Promise<Response> {
        return fail('not implemented');
    }
}

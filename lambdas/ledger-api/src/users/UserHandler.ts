import {DELETE, GET, Handler, POST, PUT} from 'serverlith/decorators';
import {fail, ServerlithRequest, SimpleRequest, SimpleResponse, success} from 'serverlith/http';
import {CreateUserRequest} from '../types/requests/createUser';
import {UserService} from './UserService';

@Handler({path: '/users'})
export class UserHandler {

    private userService: UserService;
    constructor(){
        this.userService = new UserService();
    }

    @GET({path: '/:email'})
    public async getUser(request: SimpleRequest): Promise<SimpleResponse> {
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

    @POST({path: '/:email'})
    public async createUser(request: ServerlithRequest<CreateUserRequest>): Promise<SimpleResponse> {
        return fail(`user was: ${request.pathParams.email}`);
    }

    @PUT({path: '/:email'})
    public async updateUser(request: CreateUserRequest): Promise<SimpleResponse> {
        return fail('not implemented');
    }

    @DELETE({path: '/:email'})
    public async deleteUser(request: CreateUserRequest): Promise<SimpleResponse> {
        return fail('not implemented');
    }

    @GET({path: ''})
    public async searchUsers(request: SimpleRequest): Promise<SimpleResponse> {
        return fail('not implemented');
    }
}

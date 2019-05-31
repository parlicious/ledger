import { Handler, POST } from 'serverlith/decorators';
import {fail, ServerlithRequest, ServerlithResponse, SimpleResponse, success} from 'serverlith/http';
import { AuthRequest } from '../types/requests/auth';
import { UserService} from '../users/UserService';

@Handler({ path: '/authenticate' })
export class AuthHandler {

    private userService: UserService;

    constructor(){
        this.userService = new UserService();
    }

    @POST({path: ''})
    public async authHandler(request: ServerlithRequest<AuthRequest>): Promise<SimpleResponse> {
        const authResult = await this.userService.authenticate(request.body.token);
        if (authResult.isOk()) {
            return success(authResult.result);
        } else {
            return fail(authResult.message);
        }
    }
}

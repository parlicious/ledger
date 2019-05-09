import { inject, injectable } from 'inversify';
import { Handler, POST } from 'serverlith/decorators';
import { fail, ServerlithResponse, success } from 'serverlith/http';
import { DI } from '../di';
import { UserService} from '../services/UserService';
import { AuthRequest } from '../types/requests/auth';

@Handler({ path: '/authenticate' })
// @injectable()
export class AuthHandler {

    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
        console.log(userService);
    }

    @POST({path: ''})
    public async authHandler(request: AuthRequest): Promise<ServerlithResponse> {
        const authResult = await this.userService.authenticate(request.body.token);
        if (authResult.isOk()) {
            return success(authResult.result);
        } else {
            return fail(authResult.message);
        }
    }
}

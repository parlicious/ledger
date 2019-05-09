import { Handler, POST } from 'serverlith/decorators';
import { fail, ServerlithResponse, success } from 'serverlith/http';
import { AuthRequest } from '../types/requests/auth';
import { UserService} from '../services/UserService';

@Handler({ path: '/authenticate' })
export class AuthHandler {

    private userService: UserService;

    constructor(){
        this.userService = new UserService();
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

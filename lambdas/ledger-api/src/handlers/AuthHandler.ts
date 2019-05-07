import { Handler, POST } from 'serverlith/decorators';
import { fail, ServerlithResponse, success } from 'serverlith/http';
import { AuthRequest } from '../types/requests/auth';
import { authenticate } from '../services/UserService';

@Handler({ path: '/authenticate' })
export class AuthHandler {
    @POST({path: ''})
    public async authHandler(request: AuthRequest): Promise<ServerlithResponse> {
        const authResult = await authenticate(request.body.token);
        if (authResult.status === 'success') {
            return success(authResult.user || {});
        } else {
            return fail(authResult.message || '');
        }
    }
}

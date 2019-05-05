import {APIGatewayEvent} from 'aws-lambda';
import {router} from 'serverlith';
import {enableCORS} from 'serverlith/http';
import { AuthHandler } from './handlers/auth';
import {UserHandler} from './handlers/users';

export const handler = async (event: APIGatewayEvent) => {
    const usersHandler: any = new UserHandler();
    const authHandler: any = new AuthHandler();
    return await router(authHandler, usersHandler)
        // .withLogging()
        .registerResponseMiddleware(enableCORS)
        .handleEvent(event);
};

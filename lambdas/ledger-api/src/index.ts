import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import authHandler from './handlers/auth';
import {UserHandler} from './handlers/users';
import { enableCORS, eventToRequest, fail, responseToApiGatewayResult } from './microlith/http';
import { router } from './microlith/router';
import * as dec from './microlith/decorators';

export const handler = async (event: APIGatewayEvent) => {
    console.log(Object.getOwnPropertySymbols(dec));
    const usersHandler: any = new UserHandler();
    const routes = [
        // authHandler,
            ...usersHandler.routes,
    ];
    return await router(...routes)
        // .withLogging()
        .registerResponseMiddleware(enableCORS)
        .handleEvent(event);
};

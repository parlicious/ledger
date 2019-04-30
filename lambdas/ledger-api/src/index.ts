import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import authHandler from './handlers/auth';
import usersHandler from './handlers/users';
import { enableCORS, eventToRequest, fail, responseToApiGatewayResult } from './microlith/http';
import { router } from './microlith/router';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
    const routes = [
        authHandler,
        usersHandler,
    ];
    return await router(...routes)
        .withLogging()
        .registerResponseMiddleware(enableCORS)
        .handleEvent(event);
};

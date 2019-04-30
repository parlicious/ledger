import { APIGatewayEvent} from 'aws-lambda';
import authHandler from './handlers/auth';
import usersHandler from './handlers/users';
import { enableCORS, eventToRequest, parseBody } from './http';
import { router } from './router';

export const handler = async (event: APIGatewayEvent) => {
    return await router(
        authHandler,
        usersHandler,
        )
        .registerResponseMiddleware(enableCORS)
        .handleRequest(eventToRequest(event));
};

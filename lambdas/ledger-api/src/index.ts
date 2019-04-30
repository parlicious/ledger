import { APIGatewayEvent} from 'aws-lambda';
import authHandler from './handlers/auth';
import usersHandler from './handlers/users';
import { enableCORS, eventToRequest } from './microlith/http';
import { router } from './microlith/router';


export const handler = async (event: APIGatewayEvent) => {
    const routes = [
        authHandler,
        usersHandler,
    ];
    return await router(...routes)
        .registerResponseMiddleware(enableCORS)
        .handleRequest(eventToRequest(event));
};

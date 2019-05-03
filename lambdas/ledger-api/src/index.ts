import {APIGatewayEvent} from 'aws-lambda';
import {UserHandler} from './handlers/users';
import {enableCORS} from './microlith/http';
import {router} from './microlith/router/base';


export const handler = async (event: APIGatewayEvent) => {
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

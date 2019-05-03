import {APIGatewayEvent} from 'aws-lambda';
import {UserHandler} from './handlers/users';
import {enableCORS} from 'serverlith/dist/http';
import {router} from 'serverlith/dist/router/base';


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

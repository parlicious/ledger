import {APIGatewayEvent} from 'aws-lambda';
import {UserHandler} from './handlers/users';
import {router} from "serverlith";
import {http} from "serverlith";



export const handler = async (event: APIGatewayEvent) => {
    const usersHandler: any = new UserHandler();
    const routes = [
        // authHandler,
        ...usersHandler.routes,
    ];
    return await router(...routes)
        .withLogging()
        .registerResponseMiddleware(http.enableCORS)
        .handleEvent(event);
};

import { APIGatewayEvent } from 'aws-lambda';
import { router } from 'serverlith';
import { enableCORS } from 'serverlith/http';
import { DI } from './di';
import { AuthHandler } from './handlers/AuthHandler';
import { UserHandler } from './handlers/UserHandler';
import { container } from './inversify.config';

export const handler = async (event: APIGatewayEvent) => {
    const authHandler: any = container.get<AuthHandler>(AuthHandler);
    // const userHandler: any = container.get<UserHandler>(UserHandler);

    console.log(authHandler);
    // console.log(userHandler);

    return await router(authHandler)// , userHandler)
    // .withLogging()
        .registerResponseMiddleware(enableCORS)
        .handleEvent(event);
};

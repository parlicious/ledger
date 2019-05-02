import 'reflect-metadata';
import {dummyRequest, fail, Request, Response} from './http';
import {HandlerFunction, Route, router} from "./router";
import {routeMethod} from "./routing-dsl";
import {testEvent} from "../test";

const metadataKey = Symbol('GET');

function isFilter(): (target: object, propertyKey: string) => void {
    return registerProperty;
}

function registerProperty(target: object, propertyKey: string): void {
    let properties: string[] = Reflect.getMetadata(metadataKey, target);

    if (properties) {
        properties.push(propertyKey);
    } else {
        properties = [propertyKey];
        Reflect.defineMetadata(metadataKey, properties, target);
    }
}

interface RouteDecoratorConfig{
    path: string;
    method: string;
    handlerName: string;
}

function getFilteredProperties(origin: any): Route[] {
    const properties: RouteDecoratorConfig[] = Reflect.getMetadata(metadataKey, origin);
    const result: Route[] = [];
    properties.forEach((config) => {
        const handler: HandlerFunction = origin[config.handlerName];
        result.push(routeMethod(config.method, config.path, handler));
    });
    return result;
}

const GET = (path: string) => {
    function registerHandler(target: object, propertyKey: string): void {
        let handlers: RouteDecoratorConfig[] = Reflect.getMetadata(metadataKey, target);

        const config = {
          handlerName: propertyKey,
          method: 'GET',
          path
        };

        if (handlers) {
            handlers.push(config);
        } else {
            handlers = [config];
            Reflect.defineMetadata(metadataKey, handlers, target);
        }
    }

    return registerHandler;
};

export class Example {

    @GET('/user/:email')
    public a(request: Request): Response {
        return fail('not implemented', '401');
    }

    public b() {
        console.log('b');
    }

    public c() {
        console.log('c');
    }

    public d() {
        console.log('d');
    }
}

const t = new Example();
const props: Route[] = getFilteredProperties(t);
router(...props).handleEvent(testEvent).then(console.log).catch(console.error);

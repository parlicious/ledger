import 'reflect-metadata';
import { testEvent } from '../test';
import { fail, Request, Response } from './http';
import { HandlerFunction, Route, router } from './router';
import { nest, routeMethod } from './routing-dsl';

const metadataKey = Symbol('GET');

interface RouteDecoratorConfig {
    path: string;
    method: string;
    handlerName: string | symbol;
}

const routeMethodDecorator = (path: string, method: string): MethodDecorator => {
    return (target: object, handlerName: string | symbol): void => {
        let handlers: RouteDecoratorConfig[] = Reflect.getMetadata(metadataKey, target);

        const config = {
            handlerName,
            method,
            path,
        };

        if (handlers) {
            handlers.push(config);
        } else {
            handlers = [config];
            Reflect.defineMetadata(method, handlers, target);
        }
    };
};

const GET = (path: string): MethodDecorator => routeMethodDecorator(path, 'GET');
const PUT = (path: string): MethodDecorator => routeMethodDecorator(path, 'PUT');
const POST = (path: string): MethodDecorator => routeMethodDecorator(path, 'POST');
const DELETE = (path: string): MethodDecorator => routeMethodDecorator(path, 'DELETE');
const OPTIONS = (path: string): MethodDecorator => routeMethodDecorator(path, 'OPTIONS');

const decorators = [GET, PUT, POST, DELETE, OPTIONS];

function getDecoratedRoutes(origin: any): Route[] {
    const properties: RouteDecoratorConfig[] = decorators
        .flatMap((s) => Reflect.getMetadata(s.name, origin))
        .filter((c) => !!c);
    console.log(properties);
    const result: Route[] = [];
    properties.forEach((config) => {
        const handler: HandlerFunction = origin[config.handlerName].bind(origin);
        result.push(routeMethod(config.method, config.path, handler));
    });
    return result;
}

interface HandlerParams {
    path: string;
}

const Handler = (params?: HandlerParams): ClassDecorator => {
    return <TFunction extends Function>(target: TFunction) => {
        // save a reference to the original constructor
        const original = target;

        // a utility function to generate instances of a class
        function construct(ctor: Function, args: any[]) {
            const c: any = function() {
                // @ts-ignore
                return ctor.apply(this, args);
            };
            c.prototype = ctor.prototype;
            return new c();
        }

        // the new constructor behaviour
        const f: any = (...args: any[]) => {
            const result = construct(original, args);
            const routes = getDecoratedRoutes(result);
            if (params !== undefined) {
                result.routes = [nest(params.path, ...routes)];
            } else {
                result.routes = routes;
            }
            return result;
        };

        // copy prototype so intanceof operator still works
        f.prototype = original.prototype;

        // return new constructor (will override original)
        return f;
    };
};

@Handler({
    path: '/test',
})
export class Example {
    private readonly foo: string = 'bar';

    constructor(s?: string) {
        if (s !== undefined) {
            this.foo = s;
        }
    }

    @GET('/user/:email')
    public a(request: Request): Response {
        return fail(`not implemented (${this.foo})`, '401');
    }

    @POST('/user/:email')
    public b(request: Request): Response {
        return fail(`not implemented (${this.foo})`, '401');
    }

    @PUT('/user/:email')
    public c(request: Request): Response {
        return fail(`not implemented (${this.foo})`, '401');
    }

    @DELETE('/user/:email')
    public d(request: Request): Response {
        return fail(`not implemented (${this.foo})`, '401');
    }
}

const t: any = new Example('bat');
router(...t.routes).handleEvent(testEvent).then(console.log).catch(console.error);

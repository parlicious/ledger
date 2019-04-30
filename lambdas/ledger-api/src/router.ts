import { APIGatewayEvent } from 'aws-lambda';
import * as _ from 'lodash';
import pathRegexp = require('path-to-regexp');
import {Key} from 'path-to-regexp';
import { corsHeaders, fail, parseBody, Request, Response } from './http';

const defaultRequestMiddleware: RequestMiddleware[] = [parseBody];
const defaultResponseMiddleware: ResponseMiddleware[] = [];

export class Router {
    private routes: Route[] = [];
    private requestMiddleware: RequestMiddleware[] = [...defaultRequestMiddleware];
    private responseMiddleware: ResponseMiddleware[] = [...defaultResponseMiddleware];

    public handleRequest(rawRequest: Request): Response | null | Promise<Response | null> {
        const request = this.applyRequestMiddleware(rawRequest);
        const selectedRoute = this.routes.find((routeFunction: Route) => {
            const route = routeFunction(request, baseContext);
            return match(request, route.match).matched;
        });

        if (selectedRoute) {
            const route = selectedRoute(request, baseContext);
            const matchResult = match(request, route.match);
            const requestWithPathParams = {
                ...request,
                pathParams: matchResult.kv,
            };
            const response = route.handle(requestWithPathParams);
            return this.applyResponseMiddleware(response);
        }

        return fail('not found', '404');
    }

    public withRoutes(...routes: Route[]) {
        this.routes = this.routes.concat(routes);
        return this;
    }

    public registerRequestMiddleware(...requestMiddleware: RequestMiddleware[]): Router {
        this.requestMiddleware.push(...requestMiddleware);
        return this;
    }

    public registerResponseMiddleware(...responseMiddleware: ResponseMiddleware[]): Router {
        this.responseMiddleware.push(...responseMiddleware);
        return this;
    }

    private applyRequestMiddleware(request: Request): Request {
        return _.flow(this.requestMiddleware)(request);
    }
    private applyResponseMiddleware(response: Response | Promise<Response>): Response | Promise<Response> {
        return _.flow(this.responseMiddleware)(response);
    }}

export const router = (...routes: Route[]): Router => {
    return new Router().withRoutes(...routes);
};

interface MatchContext {
    methods: string [];
    path: string;
}

interface MatchResult {
    matched: boolean;
    kv?: object;
}

const baseContext = {
    methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
    path: '',
};

const compose = (m1: MatchContext, m2: MatchContext): MatchContext => {
  return {
      methods: m2.methods,
      path: `${m1.path}${m2.path}`,
  };
};

// type RouterFunction = (request: Request, parentContext: MatchContext) => Response | Promise<Response> |null;

interface RouterFunction {
    handle: HandlerFunction;
    match: MatchContext;
}

type Route = (request: Request, context: MatchContext) => RouterFunction;
export type RequestMiddleware = (request: Request) => Request;
export type ResponseMiddleware = (response: Response | Promise<Response>) => Promise<Response>;
type HandlerFunction = (request: Request) => Response | Promise<Response>;

export const route = (context: MatchContext, handler: HandlerFunction): Route => {
    return (request, parentContext) => {
        const c = compose(parentContext, context);
        return {
            handle: handler,
            match: c,
        };
    };
};

// Compose the given context with all of the child contexts to create new functions, then `and` them
export const nest = (pattern: string, ...routerFunctions: Route[]): Route => {
    const context = path(pattern);
    const newFns = routerFunctions.map((fn) => (r: Request, c: MatchContext) => fn(r, compose(context, c)));
    return and(...newFns);
};

export const and = (...rFns: Route[]): Route => {
    return (request: Request, context: MatchContext) => {
        const fn = _.find(rFns, (fn) => match(request, fn(request, context).match));
        const route = fn ? fn : rFns[0];
        return route(request, context);
    };
};

export const path = (pattern: string): MatchContext => {
    return {
        ...baseContext,
        path: pattern,
    };
};

export const routeMethod = (method: string, pattern: string, handler: HandlerFunction): Route => {
    return route({
        methods: [method],
        path: pattern,
    }, handler);
};

export const GET = (pattern: string, handler: HandlerFunction): Route => {
    return routeMethod('GET', pattern, handler);
};

export const POST = (pattern: string, handler: HandlerFunction): Route => {
    return routeMethod('POST', pattern, handler);
};

export const PUT = (pattern: string, handler: HandlerFunction): Route => {
    return routeMethod('PUT', pattern, handler);
};

export const OPTIONS = (pattern: string, handler: HandlerFunction): Route => {
    return routeMethod('OPTIONS', pattern, handler);
};

export const DELETE = (pattern: string, handler: HandlerFunction): Route => {
    return routeMethod('DELETE', pattern, handler);
};

// these are modifications of functions from Express's routing
// (https://github.com/expressjs/express/blob/master/lib/router/layer.js)
const match = (request: Request, c: MatchContext): MatchResult => {
    let match;
    const keys: Key[] = [];
    const regexp = pathRegexp(c.path, keys);

    if (path != null) {
        // match the path
        match = regexp.exec(request.path);
    }

    if (!match) {
        return {
            matched: false,
        };
    }

    // store values
    const params: any = {};

    for (let i = 1; i < match.length; i++) {
        const key = keys[i - 1];
        const prop = key.name;
        const val = decodeParam(match[i]);

        if (val !== undefined || !(prop in params)) {
            params[prop] = val;
        }
    }

    return {
        kv: params,
        matched: true,
    };
};

const decodeParam = (val: any) => {
    if (typeof val !== 'string' || val.length === 0) {
        return val;
    }
    return decodeURIComponent(val);
};

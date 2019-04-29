import { APIGatewayEvent } from 'aws-lambda';
import * as _ from 'lodash';
import {fail, standardHeaders, Request, Response} from './http';
import pathRegexp = require('path-to-regexp');
import {Key} from "path-to-regexp";

export class Router {
    private routes: RouterFunction[] = [];

    public handleRequest(request: Request): Response | null | Promise<Response | null> {
        console.log(this.routes);
        const selectedRoute = this.routes.find((routeFunction) => {

            // TODO: need to fix this, it executes handler logic twice.
            const response = routeFunction(request, baseContext);
            console.log(response);
            // console.log(`request was: ${JSON.stringify(request)} with response: ${JSON.stringify(routeFunction(request, baseContext))}`);
            return !!response;
        });


        if (selectedRoute) {
            return selectedRoute(request, baseContext);
        }

        return fail('not found', '404');
    }

    public withRoutes(...routes: RouterFunction[]){
        this.routes = this.routes.concat(routes);
        return this;
    }
}

export const router = (...routes: RouterFunction[]): Router => {
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

type RouterFunction = (request: Request, parentContext: MatchContext) => Response | Promise<Response> |null;

interface OtherRouterFunction {
    route: HandlerFunction,
    match: RoutePredicate,
}

type HandlerFunction = (request: Request) => Response | Promise<Response>;

type RoutePredicate = (request: Request) => MatchResult;

// type RouteMatcher = (request: Request, path: string) => {matches: boolean, keys: string[], }

const matches = (request: Request, context: MatchContext): MatchResult => {
    console.log(`${request.path} :: ${context.path} (${request.path === context.path})`);
    return {
        matched: request.path === context.path,
    };
};

export const route = (context: MatchContext, handler: HandlerFunction): RouterFunction => {
    return (request, parentContext) => {
        const c = compose(parentContext, context);
        const matchResult = match(request, c);
        if (matchResult.matched) {
            return handler({
                ...request,
                pathParams: matchResult.kv
            });
        }

        return null;
    };
};

export const eventToRequest = (event: APIGatewayEvent): Request => {
    // console.log(event);
    const {body, httpMethod, path, queryStringParameters} = event;
    return {
        body,
        httpMethod,
        queryParams: queryStringParameters,
        pathParams: null,
        path,
    };
};

// Compose the given context with all of the child contexts to create new functions, then `and` them
export const nest = (pattern: string, ...routerFunctions: RouterFunction[]): RouterFunction => {
    const context = path(pattern);
    const newFns = routerFunctions.map((fn) => (r: Request, c: MatchContext) => fn(r, compose(context, c)));
    return and(...newFns);
};

export const and = (...rFns: RouterFunction[]): RouterFunction => {
    return (request: Request, context: MatchContext) => {
        console.log(context);
        const fn = _.find(rFns, (f) => f(request, context));
        return fn ? fn(request, context) : null;
    };
};

export const path = (pattern: string): MatchContext => {
    return {
        ...baseContext,
        path: pattern,
    };
};

export const routeMethod = (method: string, pattern: string, handler: HandlerFunction): RouterFunction => {
    return route({
        methods: [method],
        path: pattern,
    }, handler);
};

export const GET = (pattern: string, handler: HandlerFunction): RouterFunction => {
    return routeMethod('GET', pattern, handler);
};

export const POST = (pattern: string, handler: HandlerFunction): RouterFunction => {
    return routeMethod('POST', pattern, handler);
};

export const PUT = (pattern: string, handler: HandlerFunction): RouterFunction => {
    return routeMethod('PUT', pattern, handler);
};

export const OPTIONS = (pattern: string, handler: HandlerFunction): RouterFunction => {
    return routeMethod('OPTIONS', pattern, handler);
};

export const DELETE = (pattern: string, handler: HandlerFunction): RouterFunction => {
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
    // const matchedPath = match[0];

    for (let i = 1; i < match.length; i++) {
        const key = keys[i - 1];
        const prop = key.name;
        const val = decode_param(match[i]);

        if (val !== undefined || !(prop in params)) {
            params[prop] = val;
        }
    }

    return {
        matched: true,
        kv: params,
    }
};

const decode_param = (val: any) => {
    if (typeof val !== 'string' || val.length === 0) {
        return val;
    }
    return decodeURIComponent(val);
};

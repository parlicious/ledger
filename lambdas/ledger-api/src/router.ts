/*
 * General idea here is to write something similar to the Spring 2
 * functional router, but it handles ALBEvents and routes / responds
 * accordingly
 *
 * TODO: check out https://github.com/pillarjs/path-to-regexp
 */

import { ALBEvent, APIGatewayEvent } from 'aws-lambda';
import * as _ from 'lodash';
import {fail, standardHeaders} from './http';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'OPTIONS' | 'DELETE';

export interface Request {
    httpMethod: string;
    body: any;
    params: any;
    path: string;
}

export interface Response {
    statusCode: string;
    body: any;
    headers: object;
}

export class Router {
    public routes: RouterFunction[] = [];

    public handleRequest(request: Request): Response | null | Promise<Response | null> {
        console.log(this.routes);
        const selectedRoute = this.routes.find((routeFunction) => {
            const response = routeFunction(request, baseContext) !== null;
            // console.log(`request was: ${JSON.stringify(request)} with response: ${JSON.stringify(routeFunction(request, baseContext))}`);
            return response;
        });
        console.log(selectedRoute);
        if (selectedRoute) {
            return selectedRoute(request, baseContext);
        }

        return fail('not found', '404');
    }

    public nest(pattern: string, ...routerFunctions: RouterFunction[]) {
        const context = path(pattern);
        const newFns = routerFunctions.map((fn) => (r: Request, c: MatchContext) => fn(r, compose(context, c)));
        this.routes.push(and(...newFns));

        return this;
    }

    public route(context: MatchContext, handler: HandlerFunction): Router {
        this.routes.push((request, parentContext) => {
            const c = compose(parentContext, context);
            console.log(c);
            if (matches(request, c).matched) {
                return handler(request);
            }

            return null;
        });

        return this;
    }
}

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

type RouterFunction = (request: Request, parentContext: MatchContext) => Response | null;

type HandlerFunction = (request: Request) => Response;

type RoutePredicate = (request: Request) => boolean;

// type RouteMatcher = (request: Request, path: string) => {matches: boolean, keys: string[], }

export const nroute = (predicate: RoutePredicate, handler: HandlerFunction): RouterFunction => {
    return ((request) => {
        if (predicate(request)) {
            return handler(request);
        }

        return null;
    });
};

const matches = (request: Request, context: MatchContext): MatchResult => {
    console.log(`${request.path} :: ${context.path} (${request.path === context.path})`);
    return {
        matched: request.path === context.path,
    };
};

export const route = (context: MatchContext, handler: HandlerFunction): RouterFunction => {
    return (request, parentContext) => {
        const c = compose(parentContext, context);
        console.log(c);
        if (matches(request, c)) {
            return handler(request);
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
        params: queryStringParameters,
        path,
    };
};

const pathMatches = (path: string, pattern: string | RegExp): boolean => {
    console.log(`matching path: ${path} to pattern: ${pattern}`);
    if (typeof pattern === 'string') {
        return path === pattern;
    } else {
        return pattern.test(path);
    }
};

// Compose the given context with all of the child contexts to create new functions, then `and` them
export const nest = (context: MatchContext, ...routerFunctions: RouterFunction[]): RouterFunction => {
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

export const GET = (pattern: string): MatchContext => {
    return {
        methods: ['GET'],
        path: pattern,
    };
};

export const POST = (pattern: string): MatchContext => {
    return {
        methods: ['POST'],
        path: pattern,
    };
};

// function match(path) {
//     let match;
//
//     if (path != null) {
//         // fast path non-ending match for / (any path matches)
//         if (this.regexp.fast_slash) {
//             this.params = {};
//             this.path = '';
//             return true;
//         }
//
//         // fast path for * (everything matched in a param)
//         if (this.regexp.fast_star) {
//             this.params = {0: decode_param(path)};
//             this.path = path;
//             return true;
//         }
//
//         // match the path
//         match = this.regexp.exec(path);
//     }
//
//     if (!match) {
//         this.params = undefined;
//         this.path = undefined;
//         return false;
//     }
//
//     // store values
//     this.params = {};
//     this.path = match[0];
//
//     const keys = this.keys;
//     const params = this.params;
//
//     for (let i = 1; i < match.length; i++) {
//         const key = keys[i - 1];
//         const prop = key.name;
//         const val = decode_param(match[i]);
//
//         if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
//             params[prop] = val;
//         }
//     }
//
//     return true;
// }
//
// /**
//  * Decode param value.
//  *
//  * @param {string} val
//  * @return {string}
//  * @private
//  */
//
// function decode_param(val: any) {
//     if (typeof val !== 'string' || val.length === 0) {
//         return val;
//     }
//
//     try {
//         return decodeURIComponent(val);
//     } catch (err) {
//         if (err instanceof URIError) {
//             err.message = 'Failed to decode param \'' + val + '\'';
//             err.status = err.statusCode = 400;
//         }
//
//         throw err;
//     }
// }

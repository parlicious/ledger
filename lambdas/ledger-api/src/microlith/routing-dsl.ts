import * as _ from 'lodash';
import { Request, Response} from './http';
import { baseContext, HandlerFunction, match, MatchContext, Route } from './router';

export const route = (context: MatchContext, handler: HandlerFunction): Route => {
    return (request, parentContext) => {
        const c = compose(parentContext, context);
        return {
            handle: handler,
            match: c,
        };
    };
};

const compose = (m1: MatchContext, m2: MatchContext): MatchContext => {
    return {
        methods: m2.methods,
        path: `${m1.path}${m2.path}`,
    };
};

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

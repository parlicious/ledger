/*
 * General idea here is to write something similar to the Spring 2
 * functional router, but it handles ALBEvents and routes / responds
 * accordingly
 *
 */

import {ALBEvent} from "aws-lambda";
import {fail, standardHeaders} from "./http";

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

export class Router{
    routes: RouterFunction[];

    constructor(routes: RouterFunction[]){
        this.routes = routes;
    }

    handleRequest(request: Request): Response | null | Promise<Response | null> {
        const route = this.routes.find(route => {
            const response = route(request) !== null;
            console.log(`request was: ${JSON.stringify(request)} with response: ${JSON.stringify(route(request))}`);
            return response;
        });
        if(route){
            return route(request);
        }

        return fail('not found', '404');
    }
}

interface RouterFunction {
    (request: Request): Response | null
}

interface HandlerFunction {
    (request: Request): Response
}

interface RoutePredicate {
    (request: Request): boolean
}

export const route = (predicate: RoutePredicate, handler: HandlerFunction): RouterFunction => {
    return (request => {
        if(predicate(request)){
            return handler(request);
        }

        return null;
    })
};

export const eventToRequest = (event: ALBEvent): Request => {
    const {body, httpMethod, path, queryStringParameters} = event;
    return {
        body,
        httpMethod,
        path,
        params: queryStringParameters,
    }
};

const pathMatches = (path: string, pattern: string | RegExp): boolean => {
    console.log(`matching path: ${path} to pattern: ${pattern}`);
    if(typeof pattern === 'string'){
        return path === pattern;
    } else if(pattern instanceof RegExp){
        return pattern.test(path);
    }

    return false;
};

export const GET = (pattern: string | RegExp): RoutePredicate => {
    return (request: Request) => request.httpMethod === 'GET' && pathMatches(request.path, pattern);
};

export const POST = (pattern: string | RegExp): RoutePredicate => {
    return (request: Request) => request.httpMethod === 'POST' && pathMatches(request.path, pattern);
};

export const PUT = (pattern: string | RegExp): RoutePredicate => {
    return (request: Request) => request.httpMethod === 'PUT' && pathMatches(request.path, pattern);
};

export const DELETE = (pattern: string | RegExp): RoutePredicate => {
    return (request: Request) => request.httpMethod === 'DELETE' && pathMatches(request.path, pattern);
};

export const OPTIONS = (pattern: string | RegExp): RoutePredicate => {
    return (request: Request) => request.httpMethod === 'OPTIONS' && pathMatches(request.path, pattern);
};



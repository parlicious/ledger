import {APIGatewayEvent} from "aws-lambda";

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Origin, Referer, User-Agent",
    "Access-Control-Expose-Headers:": "*",
    "Access-Control-Max-Age": 86400,
};

export interface Request {
    httpMethod: string;
    body: any;
    queryParams: any;
    pathParams: any;
    path: string;
}

export interface Response {
    statusCode: string;
    body: any;
    headers: {[name: string]: any};
}

const respondWith = () => new ResponseBuilder();

/*
 * In a perfect world, these could be composable functions,
 * but that's just asking for a confusing slew of nested parentheses
 * once/if the pipeline (|>) operator is accepted, this should change.
 */
class ResponseBuilder {
    response: Response = {
        statusCode: '500',
        body: {},
        headers: {}
    };

    status(statusCode: string) {
        this.response.statusCode = statusCode;
        return this;
    }

    ok(): ResponseBuilder {
        this.response.statusCode = '200';
        return this;
    }

    created(): ResponseBuilder {
        this.response.statusCode = '204';
        return this;
    }

    fail(message: string): ResponseBuilder {
        this.response.statusCode = '400';
        this.response.body = {message};
        return this;
    }

    notFound(): ResponseBuilder {
        this.response.statusCode = '404';
        this.response.body = {message: 'Not Found'}
        return this;
    }

    header(key: string, value: string): ResponseBuilder {
        this.response.headers[key] = value;
        return this;
    }

    headers(headers: { [name: string]: any }): ResponseBuilder {
        this.response.headers = {
            ...this.response.headers,
            ...headers
        };

        return this;
    }

    allowingCORS(): ResponseBuilder {
        this.response.headers = {
            ...this.response.headers,
            ...corsHeaders
        };

        return this;
    }

    send(body: object) {
        this.response.body = body;
        return this.response;
    }

}

export const eventToRequest = (event: APIGatewayEvent): Request => {
    const {body, httpMethod, path, queryStringParameters} = event;
    return {
        body,
        httpMethod,
        queryParams: queryStringParameters,
        pathParams: null,
        path,
    };
};

export const fail = (message: string, statusCode = '400'): Response => {
    const responseBody = {
        message
    };

    return respondWith()
        .status(statusCode)
        .send(responseBody);
};

export const success = (responseBody: object): Response => {
    return respondWith()
        .ok()
        .send(responseBody);
};


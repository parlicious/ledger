import { ALBCallback, ALBEvent, ALBEventRequestContext, APIGatewayEvent, APIGatewayProxyEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import {fail, success} from './http';
import { eventToRequest, GET, nest, path, POST, Request, route, Router } from "./router";

const s3 = new AWS.S3();
const lambda = new AWS.Lambda();

const DATA_BUCKET = process.env.DATA_BUCKET_NAME || 'parledger-data-public';

const getUser = async (email: string): Promise<object | undefined> => {
    const key = `users/${email}`;
    const params = {
        Bucket: DATA_BUCKET,
        Key: key,
    };

    let data;
    try {
        data = await s3.getObject(params).promise();
        if (data && data.Body && typeof data.Body === 'string') {
            return JSON.parse(data.Body);
        }
    } catch (e) {
        console.log(e);
    }
};

const savePicks = async (key: string, picks: object) => {

    const params = {
        Body: JSON.stringify(picks),
        Bucket: DATA_BUCKET,
        Key: key,
    };

    await s3.putObject(params).promise();
};

const handleGet = async (event: ALBEvent) => {
    const params = event.queryStringParameters;
    return fail('not implemented');
};

const handlePost = async (event: ALBEvent) => {
    const body = JSON.parse(event.body || '');
    return fail('not implemented');
};

const handleOptions = async (event: ALBEvent) => {
    return success({});
};

export const handler = async (event: APIGatewayEvent, context: ALBEventRequestContext | undefined, callback: ALBCallback | undefined ) => {
    // console.log('Received event:', JSON.stringify(event, null, 2));
    return new Router()
        .route(GET('/test'), (request: Request) => {
            // console.log(JSON.stringify(request));
            return success({message: 'this was a get'});
        })
        .route(POST('/test'), (request: Request) => {
            return success({message: 'this was a post'});
        })
        .nest('/parent',
                route(GET('/test'), (request: Request) => {
                    // console.log(JSON.stringify(request));
                    return success({message: 'this was a nested get'});
                }))
        .handleRequest(eventToRequest(event));
};


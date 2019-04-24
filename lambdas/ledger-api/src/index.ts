import {ALBCallback, ALBEvent, ALBEventRequestContext} from 'aws-lambda';
import * as AWS from 'aws-sdk';
import {fail, success} from './http';
import {eventToRequest, GET, route, Router} from "./router";

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

export const handler = async (event: ALBEvent, context: ALBEventRequestContext, callback: ALBCallback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const router = new Router(
        [
            route(GET('/test'), (request) => {
                return success({message: 'router works'})
            })
        ],
    );

    const request = eventToRequest(event);
    return router.handleRequest(request);
};

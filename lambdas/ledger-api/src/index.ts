import {fail, success} from "./http";
import * as AWS from 'aws-sdk';
import {ALBCallback, ALBEvent, ALBEventRequestContext} from "aws-lambda";

const s3 = new AWS.S3();
const lambda = new AWS.Lambda();

const DATA_BUCKET = process.env.DATA_BUCKET_NAME || 'parledger-data-public';

const getUser = async (email: string): Promise<object | undefined> => {
    const key = `users/${email}`;
    const params = {
        Bucket: DATA_BUCKET,
        Key: key
    };

    let data;
    try {
        data = await s3.getObject(params).promise();
        if (data && data.Body && typeof data.Body === 'string') {
            return JSON.parse(data.Body)
        }
    } catch (e) {
        console.log(e);
    }
};

const savePicks = async (key: string, picks: object) => {

    const params = {
        Bucket: DATA_BUCKET,
        Key: key,
        Body: JSON.stringify(picks)
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
    switch (event.httpMethod) {
        case 'POST':
            return handlePost(event);
        case 'GET':
            return handleGet(event);
        case 'OPTIONS':
            return handleOptions(event);
        default:
            return fail('Method Not Allowed', '405')
    }
};

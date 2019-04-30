import {ALBCallback, ALBEvent, ALBEventRequestContext, APIGatewayEvent, APIGatewayProxyEvent} from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { corsHeaders, enableCORS, eventToRequest, Request, Response, success } from './http';
import {GET, nest, path, POST, route, router, Router} from './router';

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

function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sleep() {
    await timeout(3000);
    return 'done';
}

export const handler = async (event: APIGatewayEvent) => {
    return await router(
            GET('/test', (request: Request) => {
                return success({message: 'this was a get'});
            }),
            POST('/test', (request: Request) => {
                return success({message: 'this was a post'});
            }),
            nest('/parent',
                GET('/test', async (request: Request) => {
                    // await sleep();
                    return success({message: 'this was a nested get'});
                }),
            ))
        .registerResponseMiddleware(enableCORS)
        .handleRequest(eventToRequest(event));
};

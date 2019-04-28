import { APIGatewayEvent, APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from './index';

const event: APIGatewayEvent = {
    resource: '/{proxy+}',
    path: '/parent/test',
    httpMethod: 'GET',
    headers: {
        'Accept': '*/*',
        'accept-encoding': 'gzip, deflate',
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
        'Host': 'ho939c3r9c.execute-api.us-east-1.amazonaws.com',
        'Postman-Token': '4c436f07-0928-4e80-b51e-412aeadb00dc',
        'User-Agent': 'PostmanRuntime/7.6.1',
        'X-Amzn-Trace-Id': 'Root=1-5cc1ccee-5eb64999991c78aec62b1d7c',
        'X-Forwarded-For': '12.226.55.226',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https',
    },
    multiValueHeaders: {
        'Accept': [
            '*/*',
        ],
        'accept-encoding': [
            'gzip, deflate',
        ],
        'cache-control': [
            'no-cache',
        ],
        'Content-Type': [
            'application/json',
        ],
        'Host': [
            'ho939c3r9c.execute-api.us-east-1.amazonaws.com',
        ],
        'Postman-Token': [
            '4c436f07-0928-4e80-b51e-412aeadb00dc',
        ],
        'User-Agent': [
            'PostmanRuntime/7.6.1',
        ],
        'X-Amzn-Trace-Id': [
            'Root=1-5cc1ccee-5eb64999991c78aec62b1d7c',
        ],
        'X-Forwarded-For': [
            '12.226.55.226',
        ],
        'X-Forwarded-Port': [
            '443',
        ],
        'X-Forwarded-Proto': [
            'https',
        ],
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: {
        proxy: 't',
    },
    stageVariables: null,
    requestContext: {
        resourceId: 'qrejt8',
        resourcePath: '/{proxy+}',
        httpMethod: 'GET',
        extendedRequestId: 'Ysz1NElaoAMF3Tw=',
        requestTime: '25/Apr/2019:15:06:22 +0000',
        path: '/default/t',
        accountId: '895817813588',
        stage: 'default',
        requestTimeEpoch: 1556204782119,
        requestId: 'afdd5393-676b-11e9-b432-297fc72124f9',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '12.226.55.226',
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'PostmanRuntime/7.6.1',
            user: null,
            apiKey: null,
            apiKeyId: null,
        },
        domainName: 'ho939c3r9c.execute-api.us-east-1.amazonaws.com',
        apiId: 'ho939c3r9c',
    },
    body: '{\n\t\n}',
    isBase64Encoded: false,
};

const test = () => {
    handler(event, undefined, undefined).then(console.log).catch(console.error);
};

test();

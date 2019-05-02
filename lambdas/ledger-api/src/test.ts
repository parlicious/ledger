import { APIGatewayEvent, APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from './index';

export const testEvent: APIGatewayEvent = {
    resource: '/{proxy+}',
    path: '/user/parliciousapp%40gmail.com',
    httpMethod: 'POST',
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
    body: JSON.stringify({token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjVkODg3ZjI2Y2UzMjU3N2M0YjVhOGExZTFhNTJlMTlkMzAxZjgxODEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTA5NjUzOTYwMzM1My11c3N0bDY1bnZsZHVyZmRzYmU2anNrdWFjOWhjc29lZy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwOTY1Mzk2MDMzNTMtdXNzdGw2NW52bGR1cmZkc2JlNmpza3VhYzloY3NvZWcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc5NzgyNDE5MDcxMDE4MTM4NzgiLCJlbWFpbCI6InBhcmxpY2lvdXNhcHBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiI4Q3VYLV80OXJSNDE0bkJEN1dBUm1RIiwibmFtZSI6IkRvbm5pZSBNYXR0aW5nbHkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDUuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy14V2VPdE9SeVVsSS9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ0hpM3JmWTFpY0hDSDU0dHhnWWFGOWpscTJFNXdLckh3L3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJEb25uaWUiLCJmYW1pbHlfbmFtZSI6Ik1hdHRpbmdseSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNTU2NjQzMzE2LCJleHAiOjE1NTY2NDY5MTYsImp0aSI6IjY3OWQ3ZDA3NGRkNWE5ZDlkZmE2NDE0OTU4YjUyMzE3ZjZlZDVkZWQifQ.1X3jgnELUlOfDFhC1SSjLuLogoWWACPTanIe8hl_vdsafiX2GZ0aiJ2q5TY3hgANncpihS1kEZ-APcnOJxNU9Puiu_QpqBhW3It62SvYAbwVl-j2LtXkGHYQWSXfbSo47kQ_EUDPG4RLSRDFQZFWoe78kWz3pQy9Dwf0OvdBX_xrDC6TT8MinCvRozTuU3rn58DuL6RUBSONCRXF-NdVY_OAU_wBkKm-NiSCd-BVFLtyw_xFj2afMeV172TTraoGm110ilF6hKH9t4x-QfGRXCoqet6zatXNsfS7yT1HpuMSdcp-LUwwZtDHhs1iBL4YmvbgHo_WRYInWg4TTfiEQg"}),
    isBase64Encoded: false,
};

// const test = () => {
//     handler(testEvent).then(console.log).catch(console.error);
// };

// test();

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const lambda = new AWS.Lambda();

const standardHeaders = {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Origin, Referer, User-Agent",
    "Access-Control-Expose-Headers:": "*",
    "Access-Control-Max-Age": 86400,
};

const DATA_BUCKET = process.env.DATA_BUCKET_NAME || 'parledger-data-public';

const fail = (message, statusCode = '400') => {
    const responseBody = {
        message
    };

    return {
        statusCode: statusCode,
        body: JSON.stringify(responseBody),
        headers: {
            ...standardHeaders,
        }
    }
};

const success = (responseBody) => {
    return {
        statusCode: '200',
        body: JSON.stringify(responseBody),
        headers: {
            ...standardHeaders,
        }
    }
};

const getPick = async (key) => {
    const params = {
        Bucket: DATA_BUCKET,
        Key: key
    };

    let data;
    try {
        data = await s3.getObject(params).promise();
    } catch (e) {
        console.log(e);
    }

    return JSON.parse(data.Body);
};

const savePicks = async (key, picks) => {

    const params = {
        Bucket: DATA_BUCKET,
        Key: key,
        Body: JSON.stringify(picks)
    };

    await s3.putObject(params).promise();
};

const handleGet = async (event) => {
    const params = event.queryStringParameters;
    return fail('not implemented');
};

const handlePost = async (event) => {
    const body = JSON.parse(event.body);
    return fail('not implemented');
};

const handleOptions = async (event) => {
    return success({});
};


exports.handler = async (event, context, callback) => {
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

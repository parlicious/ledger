export const standardHeaders = {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Origin, Referer, User-Agent",
    "Access-Control-Expose-Headers:": "*",
    "Access-Control-Max-Age": 86400,
};

export const fail = (message: string, statusCode = '400') => {
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

export const success = (responseBody: object) => {
    return {
        statusCode: '200',
        body: JSON.stringify(responseBody),
        headers: {
            ...standardHeaders,
        }
    }
};


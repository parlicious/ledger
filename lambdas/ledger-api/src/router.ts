type HttpMethod = 'GET' | 'POST' | 'PUT' | 'OPTIONS' | 'DELETE';

interface Request {
    method: HttpMethod;
    hostname: string;
    body: any;
    params: any;
}



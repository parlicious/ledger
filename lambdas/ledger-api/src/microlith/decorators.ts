import 'reflect-metadata';
import {fail, Request, Response} from './http';

const metadataKey = Symbol('GET');

function isFilter(): (target: object, propertyKey: string) => void {
    return registerProperty;
}

function registerProperty(target: object, propertyKey: string): void {
    let properties: string[] = Reflect.getMetadata(metadataKey, target);

    if (properties) {
        properties.push(propertyKey);
    } else {
        properties = [propertyKey];
        Reflect.defineMetadata(metadataKey, properties, target);
    }
}

function registerHandler(target: object, propertyKey: string): void {
    let handlers: string[] = Reflect.getMetadata(metadataKey, target);

    if (handlers) {
        handlers.push(propertyKey);
    } else {
        handlers = [propertyKey];
        Reflect.defineMetadata(metadataKey, handlers, target);
    }
}

function getFilteredProperties<T, K>(origin: T): object {
    const properties: Array<keyof T> = Reflect.getMetadata(metadataKey, origin);
    const result: any = {};
    properties.forEach((key: keyof T) => result[key] = origin[key]);
    return result;
}

const GET = (path: string) => {
    return registerHandler;
};

export class Example {

    @GET('/path')
    public a(request: Request): Response {
        return fail('not implemented');
    }

    public b() {
        console.log('b');
    }

    public c() {
        console.log('c');
    }

    public d() {
        console.log('d');
    }
}

const t = new Example();
const props: {keyof Example: } = getFilteredProperties(t);
console.log(props.a());

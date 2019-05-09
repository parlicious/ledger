import { Entity } from '../serverlithdb';

export interface User extends Entity{
    key: string;
    id?: string;
    status: string;
    email?: string;
}

import { Entity } from '../serverlithdb';

export interface User extends Entity {
    id?: string;
    email?: string;
}

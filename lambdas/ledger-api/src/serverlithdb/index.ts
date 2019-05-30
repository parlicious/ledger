import {Err, Errors, Result} from '../types/util';
import { Wager } from '../types/wager';
import { S3Client } from './s3';

const DB_ROOT = '/db';
const DATA_ROOT = '/data';
const VIEWS_ROOT = '/views';
type Membership = 'membership'; // don't need to pull existing view to modify
type Aggregate = 'aggregate'; // need to pull existing view to modify
type ViewType = Membership | Aggregate;

/**
 * View
 */
export interface View<T extends Entity> {
    name: string;
    type: ViewType;
    params: { [s: string]: string | number };
    created_on: number;
    last_updated_on: number;
    initialize: (data: T[]) => T[];
}

export interface AggregateView<T extends Entity> extends View<T> {
    type: 'aggregate';
    create: (datum: T, current: T[]) => T[] | null;
    update: (datum: T, current: T[]) => T[] | null;
    delete: (datum: T, current: T[]) => T[] | null;
    current: T[];
}

export interface MembershipView<T extends Entity> extends View<T> {
    type: 'membership';
    included: (datum: T, current: T[]) => boolean;
}

/**
 * Entity
 */
export interface Entity {
    key: string;
    _rev: string;
}

function  bumpRev<T extends Entity>(t: T): T {
    const oldRev = t._rev || '';
    const count = (parseInt(oldRev.split(':')[0], 10) || 0) + 1;
    const rev = `${count.toString()}:${Math.random().toString(36).substring(2)}`;
    return {
        ...t,
        _rev: rev,
    };
}

export class Repo<T extends Entity> {

    private views: Array<View<T>> = [];
    private s3Client: S3Client;

    constructor(bucketName: string) {
        this.s3Client = new S3Client(bucketName);
    }

    public async get(key: string): Promise<Result<T>> {
        return this.s3Client.get(key);
    }

    public async create(value: T): Promise<Result<T>> {
        return this.s3Client.put(value.key, bumpRev(value));
    }

    public async update(value: T): Promise<Result<T>> {
        const current = await this.s3Client.get<T>(value.key);
        if (current.isOk() && value._rev === current.result._rev) {
            return this.s3Client.put(value.key,  bumpRev(value));
        } else {
            return Errors.conflict('_rev does not match, please use the most current version of this object');
        }
    }

    public async delete(key: string): Promise<Result<string>> {
        return this.s3Client.delete(key);
    }

    public registerView(view: View<T>) {
        this.views.push(view);
    }

    public updateAggregateViews() {
        this.views = this.views.map((view) => {
            if (view.type === 'aggregate') {
                return view;
            } else {
                return view;
            }
        });
    }
}

// Example view
const TenLargestWagersView: AggregateView<Wager> = {
    name: 'largest-wagers',
    type: 'aggregate',
    params: { count: 10 },
    created_on: Date.now(),
    last_updated_on: Date.now(),
    current: [],
    initialize: (data: Wager[]): Wager[] => {
        return data;
    },
    create: (wager: Wager, currentView: Wager[]) => {
        return currentView;
    },
    delete: (wager: Wager, currentView: Wager[]) => {
        return currentView;
    },
    update: (wager: Wager, currentView: Wager[]) => {
        return currentView;
    },
};


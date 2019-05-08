import { Wager } from '../types/wager';

const DB_ROOT = '/db';
const DATA_ROOT = '/data';
const VIEWS_ROOT = '/views';
type Membership = 'membership'; // don't need to pull existing view to modify
type Aggregate = 'aggregate'; // need to pull existing view to modify
type ViewType = Membership | Aggregate;

/**
 * View
 */
export interface View<T extends Entity, R> {
    name: string;
    type: ViewType;
    params: { [s: string]: string | number };
    created_on: number;
    last_updated_on: number;
    initialize: (data: T[]) => R;
}

export interface AggregateView<T extends Entity, R> extends View<T, R> {
    type: 'aggregate';
    create: (datum: T, current: R) => R | null;
    update: (datum: T, current: R) => R | null;
    delete: (datum: T, current: R) => R | null;
    current: R;
}

export interface MembershipView<T extends Entity, R> extends View<T, R> {
    type: 'membership';
    included: (datum: T, current: R) => boolean;
}

/**
 * Entity
 */
export interface Entity {
    key: string;
}

class Repo<T extends Entity, R> {

    private views: Array<View<T, R>> = [];

    public get(key: string): T {
        return { key: 'test' } as T;
    }

    public create(value: T) {
        console.log(`saving ${value}`);
        this.updateAggregateViews();
    }

    public update(value: T) {
        console.log(`updating ${value}`);
    }

    public delete(key: string) {
        console.log(`deleting key: ${key}`);
    }

    public registerView(view: View<T, R>) {
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
const TenLargestWagersView: AggregateView<Wager, Wager[]> = {
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

const WagerRepo = new Repo<Wager, Wager[]>();
WagerRepo.registerView(TenLargestWagersView);

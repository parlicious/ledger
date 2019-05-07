import {Wager} from "../types/wager";

const db_root = '/db';
const data_root = '/data';
const views_root = '/views';

/**
 * View
 */
interface View<T, R> {
    name: string;
    params: {[s: string]: string | number};
    created_on: number;
    last_updated_on: number;
    create: (data: T[]) => R;
    update: (datum: T, current: R) => R;
}


// Example view
const TenLargestWagersView: View<Wager, Wager[]> = {
    name: 'largest-wagers',
    params: {'count': 10},
    created_on: Date.now(),
    last_updated_on: Date.now(),
    create: (data: Wager[]): Wager[] => {
        return data;
    },
    update: (datum: Wager, current: Wager[]) => {
        return current;
    }
};
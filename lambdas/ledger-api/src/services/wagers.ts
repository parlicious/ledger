import { Wager } from '../types/wager';

export default class WagerService {
    public static getWagerById(id: string): Wager {
        return {id};
    }
}

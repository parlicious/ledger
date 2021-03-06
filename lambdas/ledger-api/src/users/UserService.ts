import {S3} from 'aws-sdk';
import {google} from 'googleapis';
import * as _ from 'lodash';
import 'source-map-support/register';
import {User} from '../types/user';
import {UserRepo} from "./UserRepo";
import {Err, Ok, Result} from "../types/util";
import {OauthUser} from "../types/requests/oauthUser";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const client = new google.auth.OAuth2(CLIENT_ID);

const DATA_BUCKET = process.env.DATA_BUCKET_NAME || 'parledger-data-public';

const loginErrors = {
    TOKEN_INVALID: 'The supplied token was invalid',
    TOKEN_MISMATCH: 'Could not validate the token for this user',
    USER_NOT_FOUND: 'The user was not found',
};

const getUserInfoFromLoginToken = async (token: string): Promise<Result<OauthUser>> => {
    let message = 'could not get user from token';
    try {
        const ticket = await client.verifyIdToken({
            audience: CLIENT_ID,
            idToken: token,
        });
        const payload = ticket.getPayload();
        if (payload) {
            const {sub: id, email} = payload;
            return new Ok({
                    key: email || '',
                    email,
                    id,
                });
        }
    } catch (e) {
        console.error(e);
        message = e.toString();
    }

    return new Err(message);
};

const usersMatch = (u1?: User | OauthUser, u2?: User | OauthUser) => {
    if (u1 && u2) {
        return u1.id === u2.id;
    }

    return false;
};

const getSanitizedUserProfile = (user?: User) => {
    return _.omit(user, ['id']);
};

export class UserService {
    private userRepo: UserRepo;

    constructor() {
        this.userRepo = new UserRepo(DATA_BUCKET);
    }

    public async getUser(email: string): Promise<Result<User>> {
        return this.userRepo.get(email);
    };

    public async createUser(): Promise<Result<User>> {
        return new Err('not implemented');
    }

    public async authenticate(token: string): Promise<Result<User>> {
        const userRequest = await getUserInfoFromLoginToken(token);
        let message = '';
        if (userRequest.isOk()) {
            const userRetrieved = await this.userRepo.get(userRequest.result.email || '');
            if (userRetrieved.isOk()) {
                if (usersMatch(userRequest.result, userRetrieved.result)) {
                    return new Ok(getSanitizedUserProfile(userRetrieved.result));
                } else {
                    message = loginErrors.TOKEN_MISMATCH;
                }
            } else {
                message = loginErrors.USER_NOT_FOUND;
            }
        } else {
            message = loginErrors.TOKEN_INVALID;
        }

        return new Err(message);
    };
}
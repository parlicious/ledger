import {google} from "googleapis";
import {S3} from "aws-sdk";
import * as _ from 'lodash';
import 'source-map-support/register';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const client = new google.auth.OAuth2(CLIENT_ID);

const DATA_BUCKET = process.env.DATA_BUCKET_NAME || 'parledger-data-public';
const s3 = new S3();
const token = "";
const loginErrors = {
    TOKEN_INVALID: 'The supplied token was invalid',
    USER_NOT_FOUND: 'The user was not found',
    TOKEN_MISMATCH: 'Could not validate the token for this user',
};

const SUCCESS = 'success';
const FAIL = 'fail';


const getUserInfoFromLoginToken = async (token: string): Promise<User> => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (payload) {
            const {sub: id, email} = payload;
            return {
                status: SUCCESS,
                id,
                email
            };
        }
    } catch (e) {
        console.error(e);
    }

    return {
        status: FAIL
    }
};

const lookupUser = async (email: string): Promise<{status: string, user?: User}> => {
    const key = `users/confirmed/${email}`;
    const params = {
        Bucket: DATA_BUCKET,
        Key: key
    };
    let data;
    try {
        data = await s3.getObject(params).promise();
        if(data && data.Body){
            return {
                status: SUCCESS,
                user: JSON.parse(data.Body.toString())
            };
        }
    } catch (e) {
        console.log(e);
    }

    return {
        status: FAIL,
    }
};

const succeeded = (res: { status: string }) => res.status === SUCCESS;

interface User {
    id?: string;
    status: string;
    email?: string;
}

const usersMatch = (u1?: User, u2?: User) => {
    if(u1 && u2){
        return u1.id === u2.id;
    }

    return false;
};

const getSanitizedUserProfile = (user?: User) => {
    const sanitizedUser = user;
    return _.omit(user, ['id']);
};

export const signIn = async (token: string) => {
    const userRequest = await getUserInfoFromLoginToken(token);
    let message = '';
    if (succeeded(userRequest)) {
        const userRetrieved = await lookupUser(userRequest.email || '');
        if (userRetrieved && succeeded(userRetrieved)) {
            if (usersMatch(userRequest, userRetrieved.user)) {
                return {
                    status: SUCCESS,
                    user: getSanitizedUserProfile(userRetrieved.user)
                }
            } else {
                message = loginErrors.TOKEN_MISMATCH;
            }
        } else {
            message = loginErrors.USER_NOT_FOUND;
        }
    } else {
        message = loginErrors.TOKEN_INVALID;
    }

    return {
        status: FAIL,
        message: message
    }
};

signIn(token)
    .then(console.log)
    .catch(console.error);

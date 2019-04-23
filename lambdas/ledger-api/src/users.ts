const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
const AWS = require('aws-sdk');
const DATA_BUCKET = process.env.DATA_BUCKET_NAME || 'parledger-data-public';
const s3 = new AWS.S3();
const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM3ODJkM2YwYmM4OTAwOGQ5ZDJjMDE3MzBmNzY1Y2ZiMTlkM2I3MGUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTA5NjUzOTYwMzM1My11c3N0bDY1bnZsZHVyZmRzYmU2anNrdWFjOWhjc29lZy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwOTY1Mzk2MDMzNTMtdXNzdGw2NW52bGR1cmZkc2JlNmpza3VhYzloY3NvZWcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc5NzgyNDE5MDcxMDE4MTM4NzgiLCJlbWFpbCI6InBhcmxpY2lvdXNhcHBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiIxSGJieGV0cGJoaWxiSm1MaVB3U25RIiwibmFtZSI6IkRvbm5pZSBNYXR0aW5nbHkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDUuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy14V2VPdE9SeVVsSS9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ0hpM3JmWTFpY0hDSDU0dHhnWWFGOWpscTJFNXdLckh3L3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJEb25uaWUiLCJmYW1pbHlfbmFtZSI6Ik1hdHRpbmdseSIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNTU1NjgxMDc1LCJleHAiOjE1NTU2ODQ2NzUsImp0aSI6IjNhZTc2MjU0OTUwZDZlMmQ2MmJhNjJmOTk4YzIzMWRiYTBjOTU5ZDEifQ.Z6kRIKHb_X75vKIxnhWAxCssdxKgWoyve8FBTYE3s4-ucfazD5VYiMoI2yBD8V1CA7xt378FUPvL0BwpebqAJmZxDJoiHCgY2_naTT1tqpP0CmBeB49l117o-F2-s65OgcC9QoKnRLtPz3IfYdnPyANp651DqRD_qQNWg1CwIY4oc1Iw1AMBH_10xRbS70eVYTCMpJPEowcyjGblutXaLfrdyZTq9MdJXJ8NjDlkDAZhJhwRCSxhojS9th4Zsx_WZUoX_6ySD8tp41zUmrTlKJlP5J2mCiUMHhgsZZcwu-HQMZs05fxpU_JU0UyspRngpVufaY3hRYZt09TGbzv1Ag";
const loginErrors = {
    TOKEN_INVALID: 'The supplied token was invalid',
    USER_NOT_FOUND: 'The user was not found',
    TOKEN_MISMATCH: 'Could not validate the token for this user',
};
const getUserInfoFromLoginToken = async (token: string): Promise<User> => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const {sub: id, email} = payload;
        return {
            status: 'success',
            id,
            email
        };
    } catch (e) {
        console.log(e);
        return {
            status: 'fail'
        }
    }
};
const lookupUser = async (email: string) => {
    const key = `users/confirmed/${email}`;
    const params = {
        Bucket: DATA_BUCKET,
        Key: key
    };
    let data;
    try {
        data = await s3.getObject(params).promise();
    } catch (e) {
        console.log(e);
        return {
            status: 'fail',
        }
    }

    return {
        status: 'success',
        user: JSON.parse(data.Body)
    };
};
const succeeded = (res: {status: string}) => res.status === 'success';

interface User {
    id?: string;
    status: string;
    email?: string;
}

const usersMatch = (u1: User, u2: User) => {
    return u1.id === u2.id;
};

const getUserProfile = (userObject: User) => {

};

export const signIn = async (token: string) => {
    const userRequest = await getUserInfoFromLoginToken(token);
    let message = '';
    if (succeeded(userRequest)) {
        const userRetrieved = await lookupUser(userRequest.email || '');
        if (succeeded(userRetrieved)) {
            if(usersMatch(userRequest, userRetrieved)){
                return {
                    status: 'SUCCESS',
                    user: getUserProfile(userRetrieved)
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
        status: 'FAIL',
        message: message
    }
};
signIn(token).catch(console.error);

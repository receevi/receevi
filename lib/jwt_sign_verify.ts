import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import constants from './constants';

export async function sign(payload: string, secret: string): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + constants.COOKIE_MAX_AGE;

    return new SignJWT({ payload })
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(secret));
}

export async function verify(token: string, secret: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload;
}

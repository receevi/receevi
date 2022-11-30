import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import constants from './lib/constants';
import { redirect } from 'next/navigation';
import { verify } from './lib/jwt_sign_verify';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get(constants.TOKEN_COOKIE_NAME)
    let isUserLoggedIn = false;
    if (token) {
        try {
            await verify(token.value, process.env.JWT_SECRET_KEY);
            isUserLoggedIn = true;
        } catch (error) {
        }
    }
    if (!isUserLoggedIn) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
    }
    let response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-cache');
    return response;
}

export const config = {
    matcher: [
        '/chats/:path*',
        '/changepassword/:path*',
    ],
}

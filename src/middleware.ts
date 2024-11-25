import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server'

export const config = {
    matcher: [
        '/',
        '/home'
    ],
};

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();

    if (url.pathname === '/') {
        return NextResponse.rewrite(new URL('/home', request.url));
    }
    if (url.pathname === '/home') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

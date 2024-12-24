import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { NextRequest } from 'next/server'

export const config = {
    matcher: [
        '/',
        '/home',
        '/admin',
        '/admin/super'
    ],
};

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const userCookie = (await cookies()).get('loginUser');

    if (url.pathname === '/') {
        return NextResponse.rewrite(new URL('/home', request.url));
    }

    if (url.pathname === '/home') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    const isLoggedIn = userCookie ? true : false;
    let role;
    if (isLoggedIn) {
        const userData = userCookie!.value;
        const user = JSON.parse(userData);
        role = user.role;
    } 
    // else {
    //     return NextResponse.redirect(new URL('/', request.url));
    // }

    if (url.pathname.startsWith('/admin/super')) {
        if (role || role !== "SUPER_ADMIN") {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    if (url.pathname.startsWith('/admin')) {
        if (role || role === "USER") {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    if (url.pathname === '/admin') {
        return NextResponse.redirect(new URL('/admin/reviewer', request.url));
    }

    return NextResponse.next();
}

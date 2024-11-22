// pages/api/login/route.ts (Edge Function / API)
// import { NextResponse } from 'next/server';
import { UserCredentials } from '@/src/store/user/user.types';

export const runtime = 'edge';  // 明确声明使用 Edge Runtime

export async function POST(req: Request) {
    const { username, password } = await req.json();

    // 验证用户，并获取用户信息
    const credentials: UserCredentials = {
        username:username,
        password:password
    };

    const user = fetch('http://localhost:8080/api/register',{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    console.log(user)


    return null;
}
import { NextResponse } from 'next/server';
import { UserCredentials } from '@/src/store/user/user.types';

export async function POST(req: Request) {
    try {
        // 确保请求体是 JSON 格式
        const { username, password, email } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        const credentials: UserCredentials = {
            username: username,
            password: password,
            email: email === '' ? void 0 : email,
        };

        console.log(credentials);

        return NextResponse.json(
            { message: "Login successful", credentials },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

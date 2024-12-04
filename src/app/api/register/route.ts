import { UserCredentials } from '@/src/store/user/user.types';
import { NextResponse } from 'next/server';

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
        }

        const response = await fetch('http://localhost:8080/api/user/register', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            console.error('Request failed', await response.text());
            console.log(await response.json());
        } else {
            const data = await response.json();
            console.log('User registered:', data);
        }

        return NextResponse.json(
            { message: "Register successful", credentials },
            { status: 202 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

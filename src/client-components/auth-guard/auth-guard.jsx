'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { getToken } from "@/src/tool/getLoginUser"

const AuthGuard = () => {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const token = await getToken();
            if (!token) {
                alert("你还没登录呢，老哥");
                router.push("/auth");
            }
        })();
    }, [router]);

    return <></>;
};

export default AuthGuard;

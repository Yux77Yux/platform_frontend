'use client';

import Auth from "@/src/client-components/auth/auth.compoennt";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthPage = () => {
    const router = useRouter();
    const userCookie = getCookie('loginUser')
    useEffect(()=>{
        if(userCookie){
            router.replace('/')
        }
    },[userCookie,router])

    return (
        <div style={{
            display: 'flex',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            zIndex: '101',
            backgroundColor: 'white',
        }}>
            <button onClick={() => router.back()} style={{
                display: 'block',
                fontSize: '20px',
                fontWeight: '800',
                position: 'absolute',
                top: '300px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                right: '700px',
            }}>返回</button>
            <Auth />
        </div>
    );
}

export default AuthPage;
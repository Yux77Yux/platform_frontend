import { getLoginUserId } from "@/src/tool/getLoginUser";
import { redirect } from 'next/navigation'

import { SpaceProvider } from "./context";

import SpaceUser from "@/src/server-components/space-user/space-user.component";
import SpaceOptions from "@/src/client-components/space-options/space-options.component";
import "./layout.scss"

const fetchSpace = async (userIdInt64: string) => {
    const loginId = await getLoginUserId()

    const url = 'http://localhost:8080/api/user/' + userIdInt64;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        console.error("fetchSpace failed")
        return null;
    }

    const userResponse = await response.json()

    const result = {
        user : userResponse.user,
        master : loginId === userIdInt64,
    }
    return result;
}

export default async function SpaceLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ userId: string }>;
}) {
    const userId = (await params).userId;
    const data = await fetchSpace(userId);
    if (!data) {
        redirect("/");
    }
    const { user, master } = data;

    return (
        <div className="space-layout">
            <div className="space-top">
                <div className="avatar-box">
                    <SpaceUser user={user} master={master} />
                </div>
                <div className="space-options-box">
                    <SpaceOptions master={master} id={userId} />
                </div>
            </div>
            <div>
                <SpaceProvider space={data}>
                    {children}
                </SpaceProvider>
            </div>
        </div>
    );
}

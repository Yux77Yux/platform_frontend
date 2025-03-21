import { getLoginUserId } from "@/src/tool/getLoginUser";
import { redirect } from 'next/navigation'

import { SpaceProvider } from "./context";

import SpaceUser from "@/src/client-components/space-user/space-user.component";
import SpaceOptions from "@/src/client-components/space-options/space-options.component";
import { User_Status } from "@/src/tool/user";
import "./layout.scss"

const fetchSpace = async (userIdInt64) => {
    const loginId = await getLoginUserId()

    const url = 'http://localhost:8080/api/user/' + userIdInt64;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        console.log("fetchSpace failed")
        return null;
    }

    const userResponse = await response.json()

    const result = {
        user: userResponse.user,
        master: loginId == userIdInt64,
    }
    return result;
}

export default async function SpaceLayout({
    children,
    params,
}) {
    const userId = (await params).userId;
    const data = await fetchSpace(userId);
    if (!data) {
        redirect("/");
    }
    const { user, master } = data;
    if(!user) {
        redirect("/");
    }
    const { userStatus } = user;

    const renderChildren = () => {
        if (master) return children;
        if (userStatus === User_Status.LIMITED) return <div>用户被封禁</div>;
        if (userStatus === User_Status.DELETE) return <div>用户已注销</div>;
        return children;
    };

    return (
        <div className="space-layout">
            <div className="space-top">
                <div className="avatar-box">
                    <SpaceUser user={user} master={master} />
                </div>
                <div className="space-options-box">
                    <SpaceOptions user={user} master={master} id={userId} />
                </div>
            </div>
            <div>
                <SpaceProvider space={data}>
                    {renderChildren()}
                </SpaceProvider>
            </div>
        </div>
    );
}

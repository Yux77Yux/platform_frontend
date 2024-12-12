import { cookies } from "next/headers";
import SpaceUser from "@/src/client-components/space-user/space-user.component";
import SpaceOptions from "@/src/client-components/space-options/space-options.component";
import "./layout.scss"

const fetchSpace = async (userIdInt64: string) => {
    let accessToken:string;
    
    const accessTokenCookie = (await cookies()).get('accessToken');
    if (!accessTokenCookie) {
        accessToken = "none";
    } else {
        accessToken = accessTokenCookie.value
    }
    const url = 'http://localhost:8080/api/space/' + userIdInt64 + '/' + accessToken;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        return null;
    }
    return await response.json();
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
    const { user, master } = data;
    console.log(data)

    return (
        <div className="space-template">
            <div className="space-top">
                <div className="avator-box">
                    <SpaceUser user={user} master={master} />
                </div>
                <div className="space-options-box">
                    <SpaceOptions master={master} id={userId} />
                </div>
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}

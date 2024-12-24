'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

const UserAvatar = (props: { id: number }) => {
    const [url, setUrl] = useState("/img/slience.jpg")
    const { id } = props;
    const space = "/space/" + id;

    useEffect(() => {
        const avatar = localStorage.getItem("avatar");
        const avatarUrl = !avatar || avatar === "" ? "/img/slience.jpg" : avatar
        setUrl(() => avatarUrl)
    }, [setUrl]);

    return <Image src={url}
        id="user-avatar"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
        alt=""
        onClick={() => window.open(space, '_blank')}
    />
}

export default UserAvatar
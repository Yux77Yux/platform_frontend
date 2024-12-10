'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

const UserAvator = (props: { avator: string,id:number }) => {
    const { avator,id } = props;
    const space = "/space/" + id;
    const router = useRouter();

    return <Image src={`${avator === "" ? "/img/slience.jpg" : avator}`}
        id="user-avator"
        layout="responsive"
        width={40}
        height={40}
        quality={100}
        alt=""
        onClick={()=>{router.push(space)}}
    />
}

export default UserAvator
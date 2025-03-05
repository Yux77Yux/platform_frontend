'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

const Options = () => {
    const path = usePathname();

    return <div className="types">
        <Link className={`type ${path==="/admin/reviewer" && "active"}`} href="/admin/reviewer" target="_blank">视频审核</Link>
        <Link className={`type ${path==="/admin/reviewer/comment" && "active"}`} href="/admin/reviewer/comment" target="_blank">评论审核</Link>
        <Link className={`type ${path==="/admin/reviewer/user" && "active"}`} href="/admin/reviewer/user" target="_blank">用户审核</Link>
    </div>
}

export default Options;
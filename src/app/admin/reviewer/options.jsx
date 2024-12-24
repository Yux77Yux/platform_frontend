'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

const Options = () => {
    const path = usePathname();

    return <div className="types">
        <Link className={`type ${path==="/admin/reviewer" && "active"}`} href="/admin/reviewer">视频审核</Link>
        <Link className={`type ${path==="/admin/reviewer/comment" && "active"}`} href="/admin/reviewer/comment">评论审核</Link>
        <Link className={`type ${path==="/admin/reviewer/user" && "active"}`} href="/admin/reviewer/user">用户审核</Link>
    </div>
}

export default Options;
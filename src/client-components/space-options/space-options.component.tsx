'use client';

import Link from "next/link";
import "./space-options.stylee.scss";
import { usePathname } from "next/navigation";
import { formatCount } from "@/src/tool/formatNumber"

interface PropsType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
    master: boolean;
    id: string;
}

const SpaceOptions = (props: PropsType) => {
    const { user, master, id } = props;
    const path = usePathname();
    const links = [
        { href: `/space/${id}`, label: '主页', show: true },
        { href: `/space/${id}/creations`, label: '投稿', show: true },
        { href: `/space/${id}/collections`, label: '收藏', show: master },
        { href: `/space/${id}/history`, label: '历史', show: master },
        { href: `/space/${id}/setting`, label: '设置', show: master },
    ];

    return <div className="space-options">
        {links.map((link, index) =>
            link.show && (
                <Link key={index}
                    href={link.href}
                    className={link.href === path ? "space-option-active" : "space-option"}
                >
                    {link.label}
                </Link>
            )
        )}
        <div className="followBtn">
            <div className="btn">
                <div className="name">关注数</div>
                <div className="count">{formatCount(user.followees)}</div>
            </div>

            <div className="btn">
                <div className="name">粉丝数</div>
                <div className="count">{formatCount(user.followers)}</div>
            </div>
        </div>
    </div>
}

export default SpaceOptions;
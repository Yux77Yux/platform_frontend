'use client';

import Link from "next/link";
import "./space-options.stylee.scss";
import { usePathname } from "next/navigation";

interface PropsType {
    master: boolean;
    id: string;
}

const SpaceOptions = (props: PropsType) => {
    const { master, id } = props;
    const path = usePathname();
    const links = [
        { href: `/space/${id}`, label: '主页', show: true },
        { href: `/space/${id}/creations`, label: '投稿', show: true },
        { href: `/space/${id}/collections`, label: '收藏', show: master },
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
    </div>
}

export default SpaceOptions;
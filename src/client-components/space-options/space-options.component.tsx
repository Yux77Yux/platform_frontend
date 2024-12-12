'use client';

import Link from "next/link";
import "./space-options.stylee.scss";

interface PropsType {
    master: boolean;
    id: string;
}

const SpaceOptions = (props: PropsType) => {
    const { master, id } = props;

    return <div className="space-options">
        <Link href={`/space/${id}`} className="space-option">主页</Link>
        <Link href={`/space/${id}/videos`} className="space-option">投稿</Link>
        <Link href={`/space/${id}/collections`} className="space-option" style={{
            display: master?"flex":"none"
        }}>收藏</Link>
        <Link href={`/space/${id}/setting`} className="space-option" style={{
            display: master?"flex":"none"
        }}>设置</Link>
    </div>
}

export default SpaceOptions;